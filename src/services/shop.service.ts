import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Shop, ShopDocument } from "src/schemas/shop.schema";


@Injectable()
export class ShopService {
    constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>) { }

    /// Find shop By Email
    async findShopByEmail(email: string, select = {
        email: 1,
        name: 1,
        password: 1,
        roles: 1,
        status: 1
    }) {
        return await this.shopModel.findOne({ email }).select(select).lean();
    }
} 