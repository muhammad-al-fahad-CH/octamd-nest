import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AppCategory } from './appCategory.entities';

@Schema()
export class BlogCategory extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AppCategory', required: true })
  app: AppCategory;
}

export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);