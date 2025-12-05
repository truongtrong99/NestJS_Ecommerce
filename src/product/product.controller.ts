import { Body, Controller, Header, Headers, Post } from '@nestjs/common';
import { ProductFactoryService } from './productFactory.service';
import { CreateProductDto } from 'src/dto/product.dto';

@Controller('v1/api/product')
export class ProductController {

    constructor(private readonly productFactoryService: ProductFactoryService) { }
    @Post('create')
    async createProduct(@Body() payload: CreateProductDto, @Headers() headers: any) {
        const shopId = headers['x-client-id'];
        payload.product_shop = shopId;
        return await this.productFactoryService.createProduct(payload.product_type, payload);
    }
}
