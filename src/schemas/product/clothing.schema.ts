import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shop } from '../shop.schema';

export type ClothingDocument = HydratedDocument<Clothing>;

@Schema({ timestamps: true })
export class Clothing {
    @Prop({ required: true })
    brand: string;

    @Prop()
    size: string;

    @Prop()
    material: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    product_shop: Shop;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);
