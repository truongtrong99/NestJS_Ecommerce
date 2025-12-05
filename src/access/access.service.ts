import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { randomBytes } from "crypto";
import { Model } from "mongoose";
import { SignupDTO } from "src/dto/signup.dto";
import { CREATED } from "src/model/success.response";
import { Shop, ShopDocument } from "src/schemas/shop.schema";
import { KeyTokenService } from "src/services/keyToken.service";
import { ShopService } from "src/services/shop.service";
import { getInfoData } from "src/utils";

const RoleShop = {
    ADMIN: 'ADMIN',
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR'
}

@Injectable()
export class AccessService {
    constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>, private keyTokenService: KeyTokenService, private jwtService: JwtService, private shopService: ShopService) { }

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

        const tokens = await this.createTokenPair(shop._id.toString(), shop.email, privateKey);

        const keyStore = await this.keyTokenService.createKeyToken({
            userId: shop._id.toString(),
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });

        if (!keyStore) {
            throw new BadRequestException('Error generating key token');
        }

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

        const metadata = {
            shop: getInfoData(['_id', 'name', 'email'], newShop),
            tokens
        };

        return new CREATED({ message: 'Shop created successfully', metadata });
    }

    async login({ email, password, refreshToken = null }: { email: string; password: string; refreshToken?: string | null }) {
        try {
            // Check email through findByEmail
            const foundShop = await this.shopService.findShopByEmail(email);
            if (!foundShop) {
                throw new BadRequestException('Not found shop');
            }

            // Check if password matches
            const isMatch = compareSync(password, foundShop.password);
            if (!isMatch) {
                throw new BadRequestException('Incorrect password');
            }

            // Create privateKey and publicKey
            const { publicKey, privateKey } = this.generateKeyPair();

            // Generate tokens
            const tokens = await this.createTokenPair(foundShop._id.toString(), foundShop.email, privateKey);

            // Create accessToken and refreshToken in db
            await this.keyTokenService.createKeyToken({
                userId: foundShop._id.toString(),
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            });

            // Get data and return login
            const metadata = {
                shop: getInfoData(['_id', 'name', 'email'], foundShop),
                tokens
            };

            return new CREATED({ message: 'Login successfully', metadata });
        } catch (error) {
            throw new BadRequestException('Error');
        }
    }

    async logout(keyStore: any) {
        try {
            const delKey = await this.keyTokenService.deleteKeyById(keyStore._id);
            return {
                message: 'Logout successfully',
                data: delKey
            };
        } catch (error) {
            throw new BadRequestException('Error during logout');
        }
    }

}