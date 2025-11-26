
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shop } from './shop.schema';

export type KeyTokenDocument = HydratedDocument<KeyToken>;

@Schema({ timestamps: true })
export class KeyToken {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Shop' })
    user: Shop;

    @Prop({ required: true })
    publicKey: string;

    @Prop({ required: true })
    privateKey: string;

    @Prop({ type: Array, default: [] })
    refreshToken: Array<any>;

}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken);