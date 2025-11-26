
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true })
export class Shop {
    @Prop({ trim: true, maxLength: 150 })
    name: string;

    @Prop({ trim: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'inactive', enum: ['active', 'inactive'] })
    status: string;

    @Prop({ default: false })
    verify: boolean;

    @Prop({ default: [] })
    roles: Array<any>;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);