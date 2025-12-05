import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Shop } from '../shop.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    product_name: string;

    // @Prop()
    // product_url: string;

    @Prop({ required: true })
    product_thumb: string;

    @Prop()
    product_description: string;

    @Prop({ required: true })
    product_price: number;

    @Prop({ required: true })
    product_quantity: number;

    @Prop({ required: true, enum: ['Electronics', 'Clothing', 'Furniture'] })
    product_type: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    product_shop: Shop;

    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    product_attributes: any;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
