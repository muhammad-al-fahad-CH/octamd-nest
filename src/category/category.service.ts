import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose"
import { Category } from 'src/entities/category.entities';
import { AppCategory, BlogCategory } from 'src/types/category';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>
) {}

  async findAll(): Promise<Category[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await this.categoryModel.find({});
      if(!result || !result.length) return resolve(new Error('No category found'));
      return resolve(result);
    })
  }

  async createCategory(appTitle?: string, blogTitle?: string, appId?: string): Promise<Category | Error> {
    return new Promise(async (resolve, reject) => {
      let category: AppCategory | BlogCategory;
      if(blogTitle || appId) {
        if(!blogTitle || !appId) {
          return resolve(new Error('please enter blogTitle and appId'));
        } else {
          const appCategory = await this.categoryModel.findOne({ 'category.id': appId });
          if(!appCategory) return resolve(new Error('app category not found'));
          category = {
            id: uuidv4(),
            blogTitle,
            appId,
            type: "blog"
          }
        }
      } else {
        if(!appTitle) {
          return resolve(new Error('please enter appTitle'))
        } else {
          category = {
            id: uuidv4(),
            appTitle,
            type: "app"
          }
        }
      }
  
      const result = await this.categoryModel.create({
        category
      });
  
      return resolve(result);
    })
  }
}