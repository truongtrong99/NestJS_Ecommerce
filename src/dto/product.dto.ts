import { IsString, IsNumber, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { IProduct } from 'src/model/product/IProduct';

export type ProductType = 'Electronics' | 'Clothing' | 'Furniture';


export class CreateProductDto implements IProduct {
    @IsString()
    product_name: string;

    @IsString()
    product_thumb: string;

    @IsOptional()
    @IsString()
    product_description?: string;

    @IsNumber()
    product_price: number;

    @IsNumber()
    product_quantity: number;

    @IsEnum(['Electronics', 'Clothing', 'Furniture'] as const)
    product_type: ProductType;

    @IsMongoId()
    product_shop: string;

    @IsOptional()
    product_attributes?: any;
}
