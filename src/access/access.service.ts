import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync } from "bcryptjs";
import { createPublicKey, generateKeyPairSync } from "crypto";
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
                const { privateKey, publicKey } = generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                });
                const publicKeyString = await this.keyTokenService.createKeyToken({
                    userId: newShop._id.toString(),
                    publicKey: publicKey as any
                });

                if (!publicKeyString) {
                    return {
                        code: 'SERVER_ERROR',
                        message: 'Error generating key token',
                        status: 'error'
                    }
                }
                const publicKeyObject = createPublicKey(publicKeyString);
                // console.log({ privateKey, publicKey }); // save collection key token
                // create token pair
                const accessToken = await this.jwtService.signAsync({ userId: newShop._id, email }, {
                    algorithm: 'RS256',
                    expiresIn: '2 days',
                    privateKey: privateKey
                });
                const refreshToken = await this.jwtService.signAsync({ userId: newShop._id, email }, {
                    algorithm: 'RS256',
                    expiresIn: '7 days',
                    privateKey: privateKey
                });
                try {
                    const decode = await this.jwtService.verifyAsync(accessToken, {
                        secret: publicKeyString,
                        algorithms: ['RS256']
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