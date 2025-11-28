import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync } from "bcryptjs";
import { randomBytes } from "crypto";
import { Model } from "mongoose";
import { SignupDTO } from "src/dto/signup.dto";
import { Shop, ShopDocument } from "src/schemas/shop.schema";
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
    constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>, private keyTokenService: KeyTokenService, private jwtService: JwtService) { }

    private hashPassword(password: string): string {
        const salt = genSaltSync(10);
        return hashSync(password, salt);
    }

    private generateKeyPair(): { publicKey: string; privateKey: string } {
        const publicKey = randomBytes(64).toString('hex');
        const privateKey = randomBytes(64).toString('hex');
        return { publicKey, privateKey };
    }

    private async createTokenPair(userId: string, email: string, privateKey: string): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = await this.jwtService.signAsync(
            { userId, email },
            {
                secret: privateKey,
                expiresIn: '2 days'
            }
        );
        const refreshToken = await this.jwtService.signAsync(
            { userId, email },
            {
                secret: privateKey,
                expiresIn: '7 days'
            }
        );
        return { accessToken, refreshToken };
    }

    private async validateToken(token: string, secret: string): Promise<void> {
        const decode = await this.jwtService.verifyAsync(token, { secret });
        if (decode) {
            console.log('Decode verify', decode);
        } else {
            throw new BadRequestException('Invalid token');
        }
    }

    private async createNewShop(name: string, email: string, hashedPassword: string): Promise<ShopDocument> {
        return await this.shopModel.create({
            name,
            email,
            password: hashedPassword,
            roles: [RoleShop.SHOP]
        });
    }

    private async setupAuthentication(shop: ShopDocument): Promise<{ accessToken: string; refreshToken: string }> {
        const { publicKey, privateKey } = this.generateKeyPair();

        const keyStore = await this.keyTokenService.createKeyToken({
            userId: shop._id.toString(),
            publicKey,
            privateKey
        });

        if (!keyStore) {
            throw new BadRequestException('Error generating key token');
        }

        const tokens = await this.createTokenPair(shop._id.toString(), shop.email, privateKey);

        // Validate the created access token
        await this.validateToken(tokens.accessToken, privateKey);

        return tokens;
    }

    async signUp({ name, email, password }: SignupDTO) {
        // Check if shop already exists
        const holderShop = await this.shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestException('Shop with this email already exists');
        }

        // Hash password and create new shop
        const hashedPassword = this.hashPassword(password);
        const newShop = await this.createNewShop(name, email, hashedPassword);

        if (!newShop) {
            throw new BadRequestException('Error creating shop');
        }

        // Setup authentication (keys and tokens)
        const tokens = await this.setupAuthentication(newShop);

        return {
            code: 201,
            message: 'Shop created successfully',
            metadata: {
                shop: getInfoData(['_id', 'name', 'email'], newShop),
                tokens
            },
            status: 'success'
        };
    }
}