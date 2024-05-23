import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Status extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);