import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { KeyToken } from "src/schemas/keytoken.schema";

@Injectable()
export class KeyTokenService {
    constructor(@InjectModel(KeyToken.name) private keyTokenModel: Model<KeyToken>) { }

    async createKeyToken({ userId, publicKey, privateKey, refreshToken }: { userId: string, publicKey: string, privateKey: string, refreshToken?: string }) {
        try {
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshToken: refreshToken ? refreshToken : '',
                refreshTokensUsed: []
            };
            const options = { upsert: true, new: true };

            const tokens = await this.keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens : null;
        } catch (error) {
            return error;
        }
    }

    async findByEmail(email: string) {
        return await this.keyTokenModel.findOne({ email }).lean();
    }
} 