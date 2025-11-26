import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { KeyToken } from "src/schemas/keytoken.schema";

@Injectable()
export class KeyTokenService {
    constructor(@InjectModel(KeyToken.name) private keyTokenModel: Model<KeyToken>) { }

    async createKeyToken({ userId, publicKey, privateKey }: { userId: string, publicKey: string, privateKey: string }) {
        try {
            const tokens = await this.keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey
            });

            return tokens ? tokens : null;
        } catch (error) {
            return error;
        }
    }
} 