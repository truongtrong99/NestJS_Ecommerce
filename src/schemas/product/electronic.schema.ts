import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ElectronicDocument = HydratedDocument<Electronic>;

@Schema({ timestamps: true })
export class Electronic {
    @Prop({ required: true })
    manufacturer: string;

    @Prop()
    model: string;

    @Prop()
    color: string;
}

export const ElectronicSchema = SchemaFactory.createForClass(Electronic);
