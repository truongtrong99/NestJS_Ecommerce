import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct } from 'src/model/product/IProduct';
import { Product, ProductDocument } from 'src/schemas/product/product.schema';
@Injectable()
export class ProductService {
    protected product_name: string;
    protected product_thumb: string;
    protected product_description?: string;
    protected product_price: number;
    protected product_quantity: number;
    protected product_type: string;
    protected product_shop: any;
    protected product_attributes: any;

    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) {
        this.product_name = '';
        this.product_thumb = '';
        this.product_price = 0;
        this.product_quantity = 0;
        this.product_type = '';
    }

    setProductData(data: IProduct) {
        this.product_name = data.product_name ?? '';
        this.product_thumb = data.product_thumb ?? '';
        this.product_description = data.product_description;
        this.product_price = data.product_price ?? 0;
        this.product_quantity = data.product_quantity ?? 0;
        this.product_type = data.product_type ?? '';
        this.product_shop = data.product_shop;
        this.product_attributes = data.product_attributes;
    }

    async createProduct(): Promise<Product> {
        return await this.productModel.create(this);
    }
}
