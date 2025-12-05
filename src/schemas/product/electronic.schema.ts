import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shop } from '../shop.schema';

export type ElectronicDocument = HydratedDocument<Electronic>;

@Schema({ timestamps: true })
export class Electronic {
    @Prop({ required: true })
    manufacturer: string;

    @Prop()
    model: string;

    @Prop()
    color: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    product_shop: Shop;
}

export const ElectronicSchema = SchemaFactory.createForClass(Electronic);
