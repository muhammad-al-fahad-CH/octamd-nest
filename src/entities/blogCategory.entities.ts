import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BlogCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);