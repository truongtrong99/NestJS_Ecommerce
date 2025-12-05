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
        const newElectronic = await this.electronicModel.create(this.product_attributes);
        if (!newElectronic) throw new BadRequestException('Create electronic failed');

        // Set the electronic document _id as product_attributes
        this.product_attributes = newElectronic._id;

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestException('Create product failed');
        return newProduct;
    }
}
