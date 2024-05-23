import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppCategory } from './appCategory.entities';
import { BlogCategory } from './blogCategory.entities';
import { Status } from './status.entities';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  app_category: AppCategory[];

  @Prop({ required: true })
  blog_category: BlogCategory[];

  @Prop({ required: true })
  status_category: Status[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);