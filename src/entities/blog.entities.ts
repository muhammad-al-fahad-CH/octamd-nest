import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AppCategory } from './appCategory.entities';
import { BlogCategory } from './blogCategory.entities';
import { Status } from './status.entities';

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  short_description: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, required: true, ref: "AppCategory"})
  app_category: AppCategory;

  @Prop({type: mongoose.Schema.Types.ObjectId, required: true, ref: "BlogCategory"})
  blog_category: BlogCategory;

  @Prop({ required: true })
  mainBanner: string;

  @Prop()
  scheduleDate?: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, required: true, ref: "Status"})
  status: Status;

  @Prop({ required: true })
  description: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);