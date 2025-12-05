import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Clothing, ClothingDocument } from 'src/schemas/product/clothing.schema';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product/product.schema';
import { ProductService } from './product.service';

@Injectable()
export class ClothingService extends ProductService {
    constructor(
        @InjectModel(Product.name) productModel: Model<ProductDocument>,
        @InjectModel(Clothing.name) private clothingModel: Model<ClothingDocument>
    ) {
        super(productModel);
    }

    async createProduct() {
        const newClothing = await this.clothingModel.create(this.product_attributes);
        if (!newClothing) throw new BadRequestException('Create clothing failed');

        // Set the clothing document _id as product_attributes
        this.product_attributes = newClothing._id;

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestException('Create product failed');
        return newProduct;
    }
}
