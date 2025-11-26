import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { KeyToken } from "src/schemas/keytoken.schema";

@Injectable()
export class KeyTokenService {
    constructor(@InjectModel(KeyToken.name) private keyTokenModel: Model<KeyToken>) { }

    async createKeyToken({ userId, publicKey }: { userId: string, publicKey: any }) {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await this.keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString
            });

            return tokens ? publicKeyString : null;
        } catch (error) {
            return error;
        }
    }
} 