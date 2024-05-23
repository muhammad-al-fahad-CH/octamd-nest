import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppCategory, BlogCategory } from 'src/types/category';

export enum StatusEnum {
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
  SCHEDULE = 'schedule',
  DELETE = 'delete',
  IN_REVIEW = 'in_review'
}

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  short_description: string;

  @Prop({ type: Object, required: true })
  app_category: AppCategory;

  @Prop({ type: Object, required: true })
  blog_category: BlogCategory;

  @Prop({ required: true })
  mainBanner: string;

  @Prop({ required: true })
  status: StatusEnum;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Date, required: true })
  publishedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);