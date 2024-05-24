import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/datasource/entities/category.entities';
import { AppCategory, BlogCategory } from 'src/types/category';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryModel: Repository<Category>
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
          return resolve(new Error('please enter blogTitle / appId'));
        } else {
          const appCategory = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :appId", {appId}).getOne();
          if(!appCategory) return resolve(new Error('please enter correct appId'));

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
  
      const result = this.categoryModel.create({
        category
      });
      const resultSave = await this.categoryModel.save(result);
      return resolve(resultSave);
    })
  }
}