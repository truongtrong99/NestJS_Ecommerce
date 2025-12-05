import { BadRequestException, Injectable } from '@nestjs/common';
import { ClothingService } from './services/clothing.service';
import { ElectronicService } from './services/electronic.service';
import { IProduct } from 'src/model/product/IProduct';
import { CreateProductDto } from 'src/dto/product.dto';

@Injectable()
export class ProductFactoryService {

    constructor(
        private readonly clothingService: ClothingService,
        private readonly electronicService: ElectronicService
    ) { }

    async createProduct(productType: string, payload: CreateProductDto) {
        switch (productType) {
            case 'Electronics':
                this.electronicService.setProductData(payload);
                return this.electronicService.createProduct();
            case 'Clothing':
                this.clothingService.setProductData(payload);
                return this.clothingService.createProduct();
            // case 'Furniture':
            //     // Logic to create a Furniture product
            //     return { type: 'Furniture', attributes: productAttributes };
            default:
                throw new BadRequestException('Unsupported product type');
        }
    }
}
