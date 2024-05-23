import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppCategory, BlogCategory } from 'src/types/category';

@Schema()
export class Category extends Document {
  @Prop({ type: Object, required: true })
  category: BlogCategory | AppCategory;
}

export const CategorySchema = SchemaFactory.createForClass(Category);