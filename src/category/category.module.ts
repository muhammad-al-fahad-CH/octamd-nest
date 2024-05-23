import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppCategory, AppCategorySchema } from 'src/entities/appCategory.entities';
import { BlogCategory, BlogCategorySchema } from 'src/entities/blogCategory.entities';
import { Status, StatusSchema } from 'src/entities/status.entities';

@Module({
  imports: [
  MongooseModule.forFeature([
    { name: AppCategory.name, schema: AppCategorySchema },
    { name: BlogCategory.name, schema: BlogCategorySchema },
    { name: Status.name, schema: StatusSchema },
  ])
],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}