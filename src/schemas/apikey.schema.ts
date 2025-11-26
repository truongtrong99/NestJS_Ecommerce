
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ApiKeyDocument = HydratedDocument<ApiKey>;

@Schema({ timestamps: true })
export class ApiKey {
    @Prop({ type: String, required: true, unique: true })
    key: string;

    @Prop({ default: false })
    status: boolean;

    @Prop({ type: [String], required: true, enum: ['0000', '1111', '2222'] })
    permissions: string[];
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);