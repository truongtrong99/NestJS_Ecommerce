import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync } from "bcryptjs";
import { randomBytes } from "crypto";
import { Model } from "mongoose";
import { SignupDTO } from "src/dto/signup.dto";
import { Shop } from "src/schemas/shop.schema";
import { KeyTokenService } from "src/services/keyToken.service";
import { getInfoData } from "src/utils";

const RoleShop = {
    ADMIN: 'ADMIN',
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR'
}

@Injectable()
export class AccessService {
    constructor(@InjectModel(Shop.name) private shopModel: Model<Shop>, private keyTokenService: KeyTokenService, private jwtService: JwtService) { }

    async signUp({ name, email, password }: SignupDTO) {
        try {
            const holderShop = await this.shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 'DUPLICATE_EMAIL',
                    message: 'Email already registered',
                    status: 'error'
                }
            }
            const salt = genSaltSync(10);
            const passworHash = await hashSync(password, salt);
            const newShop = await this.shopModel.create({
                name,
                email,
                password: passworHash,
                roles: [RoleShop.SHOP]
            });

            if (newShop) {
                // Generate simple keys using randomBytes
                const publicKey = randomBytes(64).toString('hex');
                const privateKey = randomBytes(64).toString('hex');

                const keyStore = await this.keyTokenService.createKeyToken({
                    userId: newShop._id.toString(),
                    publicKey,
                    privateKey
                });

                if (!keyStore) {
                    return {
                        code: 'SERVER_ERROR',
                        message: 'Error generating key token',
                        status: 'error'
                    }
                }
                // create token pair using HS256 algorithm with privateKey as secret
                const accessToken = await this.jwtService.signAsync(
                    { userId: newShop._id, email },
                    {
                        secret: privateKey,
                        expiresIn: '2 days'
                    }
                );
                const refreshToken = await this.jwtService.signAsync(
                    { userId: newShop._id, email },
                    {
                        secret: privateKey,
                        expiresIn: '7 days'
                    }
                );

                try {
                    const decode = await this.jwtService.verifyAsync(accessToken, {
                        secret: privateKey
                    });
                    console.log('Decode verify', decode);
                } catch (err) {
                    console.log('Error verify', err);
                }

                return {
                    code: 201,
                    message: 'Shop created successfully',
                    metadata: {
                        shop: getInfoData(['_id', 'name', 'email'], newShop),
                        tokens: {
                            accessToken,
                            refreshToken
                        }
                    },
                    status: 'success'
                }

            }

            return {
                code: 200,
                message: 'Error creating shop',
                metadata: null,
            }

        } catch (error) {
            return {
                code: 'ERROR',
                message: error.message,
                status: 'error'
            }
        }
    }
}