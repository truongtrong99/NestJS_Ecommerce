import { Body, Controller, Post } from '@nestjs/common';
import { ProductFactoryService } from './productFactory.service';
import { CreateProductDto } from 'src/dto/product.dto';

@Controller('v1/api/product')
export class ProductController {

    constructor(private readonly productFactoryService: ProductFactoryService) { }
    @Post('create')
    async createProduct(@Body() payload: CreateProductDto) {
        console.log('Payload received in controller:', payload);
        return await this.productFactoryService.createProduct(payload.product_type, payload);
    }
}
