import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductService } from './product.service';
import { InjectModel } from '@nestjs/mongoose';
import { Electronic, ElectronicDocument } from 'src/schemas/product/electronic.schema';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product/product.schema';

@Injectable()
export class ElectronicService extends ProductService {
    constructor(
        @InjectModel(Product.name) productModel: Model<ProductDocument>,
        @InjectModel(Electronic.name) private electronicModel: Model<ElectronicDocument>
    ) {
        super(productModel);
    }

    async createProduct() {
        const newElectronic = await this.electronicModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestException('Create electronic failed');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestException('Create product failed');
        return newProduct;
    }
}
