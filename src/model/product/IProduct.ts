import { ProductType } from "src/dto/product.dto";


export interface IProduct {
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_price: number;
    product_quantity: number;
    product_type: ProductType;
    product_shop: string;
    product_attributes?: any;
}
export type TProduct = IProduct