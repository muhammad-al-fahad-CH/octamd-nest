import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose"
import { BlogCategory } from 'src/entities/blogCategory.entities';
import { Category } from 'src/entities/category.entities';
import { AppCategory } from 'src/entities/appCategory.entities';
import { Status } from 'src/entities/status.entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(AppCategory.name) private readonly appModel: Model<AppCategory>,
    @InjectModel(BlogCategory.name) private readonly blogModel: Model<BlogCategory>,
    @InjectModel(Status.name) private readonly statusModel: Model<Status>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
) {}

getCategories(): Promise<Category | Error> {
  return new Promise(async (resolve, reject) => {
    const categories = await this.categoryModel.find({});
    if(!categories) return resolve(new Error('No categories found'));
    return resolve(categories[0]);
  });
}

postCategory(): Promise<Category | Error> {
  return new Promise(async (resolve, reject) => {
    const app_category = await this.appModel.find({});
    const blog_category = await this.blogModel.find({});
    const status_category = await this.statusModel.find({});

    const newCategory = await this.categoryModel.create({
      app_category,
      blog_category,
      status_category
    });

    const result = await newCategory.save();
    return resolve(result);
  });
}

// Portal Category

  async createAppCategory(name: string): Promise<AppCategory | Error> {
    return new Promise(async (resolve, reject) => {
      const appCategory = await this.appModel.create({
        name
      });
      const result = await appCategory.save();
      return resolve(result);
    });
  }

  async getAppCategories(): Promise<AppCategory[] | Error> {
    return new Promise(async (resolve, reject) => {
      const appCategories = await this.appModel.find({});
      if(!appCategories.length) return resolve(new Error('No portal categories found'));
      return resolve(appCategories);
    });
  }

  async putAppCategorie(id: string, name: string): Promise<AppCategory | Error> {
    return new Promise(async (resolve, reject) => {
      const findCategory = await this.appModel.findById(id);
      if(!findCategory) return resolve(new Error('Not found'));
      const appCategorie = await this.appModel.findByIdAndUpdate(id, { name });
      return resolve(appCategorie);
    });
  }

  async rmAppCategorie(id: string): Promise<AppCategory | Error> {
    return new Promise(async (resolve, reject) => {
      const findCategory = await this.appModel.findById(id);
      if(!findCategory) return resolve(new Error('Not found'));
      const appCategorie = await this.appModel.findByIdAndDelete(id);
      return resolve(appCategorie);
    });
  }

  // Blog Category

  async createBlogCategory(name: string): Promise<BlogCategory | Error> {
    return new Promise(async (resolve, reject) => {
      const blogCategory = await this.blogModel.create({
        name
      });
      const result = await blogCategory.save();
      return resolve(result);
    });
  }

  async getBlogCategories(): Promise<BlogCategory[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogCategories = await this.blogModel.find({});
      if(!blogCategories.length) return resolve(new Error('No blog categories found'));
      return resolve(blogCategories);
    });
  }

  async putBlogCategorie(id: string, name: string): Promise<BlogCategory | Error> {
    return new Promise(async (resolve, reject) => {
      const findCategory = await this.blogModel.findById(id);
      if(!findCategory) return resolve(new Error('Not found'));
      const blogCategorie = await this.blogModel.findByIdAndUpdate(id, { name });
      return resolve(blogCategorie);
    });
  }

  async rmBlogCategorie(id: string): Promise<BlogCategory | Error> {
    return new Promise(async (resolve, reject) => {
      const findCategory = await this.blogModel.findById(id);
      if(!findCategory) return resolve(new Error('Not found'));
      const blogCategorie = await this.blogModel.findByIdAndDelete(id);
      return resolve(blogCategorie);
    });
  }

  // Status

  async createStatus(name: string): Promise<Status | Error> {
    return new Promise(async (resolve, reject) => {
      const createStatus = await this.statusModel.create({
        name
      });
      const result = await createStatus.save();
      return resolve(result);
    });
  }

  async getStatus(): Promise<Status[] | Error> {
    return new Promise(async (resolve, reject) => {
      const status = await this.statusModel.find({});
      if(!status.length) return resolve(new Error('No status found'));
      return resolve(status);
    });
  }

  async putStatus(id: string, name: string): Promise<Status | Error> {
    return new Promise(async (resolve, reject) => {
      const findStatus = await this.statusModel.findById(id);
      if(!findStatus) return resolve(new Error('Not found'));
      const updateStatus = await this.statusModel.findByIdAndUpdate(id, { name });
      return resolve(updateStatus);
    });
  }

  async rmStatus(id: string): Promise<Status | Error> {
    return new Promise(async (resolve, reject) => {
      const findStatus = await this.statusModel.findById(id);
      if(!findStatus) return resolve(new Error('Not found'));
      const status = await this.statusModel.findByIdAndDelete(id);
      return resolve(status);
    });
  }
}