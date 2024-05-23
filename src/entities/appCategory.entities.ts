import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AppCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const AppCategorySchema = SchemaFactory.createForClass(AppCategory);