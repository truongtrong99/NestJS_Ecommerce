import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClothingDocument = HydratedDocument<Clothing>;

@Schema({ timestamps: true })
export class Clothing {
    @Prop({ required: true })
    brand: string;

    @Prop()
    size: string;

    @Prop()
    material: string;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);
