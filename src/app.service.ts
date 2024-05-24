import { Injectable, Logger } from '@nestjs/common';
import { Blog, StatusEnum } from './datasource/entities/blog.entities';
import { Category } from './datasource/entities/category.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Files } from './types/blog';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectRepository(Blog) private readonly blogModel: Repository<Blog>,
    @InjectRepository(Category) private readonly categoryModel: Repository<Category>,
  ) {}
  getAllBlogs(): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find({});
      for(const blog of blogs) {
        const publish = Date.parse(blog.publishedAt.toISOString())
        if(publish < Date.now()) {
          await this.blogModel.update(blog.id, { status: StatusEnum.ACTIVE });
        }
      }

      if(!blogs || !blogs.length) return resolve(new Error('No blogs found'));
      return resolve(blogs);
    })
  }

  getAllBlogsbyUser(): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await this.blogModel.find({ where: { status: StatusEnum.ACTIVE } });
      if(!result || !result.length) return resolve(new Error('No blogs found'));
      return resolve(result);
    })
  }

  getBlog(id: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const blog = await this.blogModel.findOne({ where: { id: parseInt(id, 10) } });
      if(!blog) return resolve(new Error('Not found'));
      return resolve(blog);
    })
  }

  createBlog(title: string, shortDescription: string, appCategory: string, blogCategory: string, mainBanner: Files[], status: string, description: string, publishedAt: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const blogC = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :blogCategory", {blogCategory}).getOne();
      const appC = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :appCategory", {appCategory}).getOne();
      
      if(!blogC || !appC) return resolve(new Error(`${!blogC ? 'Blog category' : 'App category'} not found`));
      const blog = this.blogModel.create({
        title,
        short_description: shortDescription,
        app_category: appCategory,
        blog_category: blogCategory,
        mainBanner,
        status: this.getStatusEnum(status) ? this.getStatusEnum(status) : StatusEnum.SCHEDULE,
        description,
        publishedAt
      });
      
      const result = await this.blogModel.save(blog);
      return resolve(result);
    })
  }

  updateBlog(id: string, title: string, shortDescription: string, appCategory: string, blogCategory: string, mainBanner: Files[], status: string, description: string, publishedAt: string): Promise<UpdateResult | Error> {
    return new Promise(async (resolve, reject) => {
      const blogC = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :blogCategory", {blogCategory}).getOne();
      const appC = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :appCategory", {appCategory}).getOne();

      if(!blogC || !appC) return resolve(new Error(`${!blogC ? 'blog category' : 'App category'} not found`));

      const findBlog = await this.blogModel.findOne({ where: { id: parseInt(id, 10) } });
      if(!findBlog) return resolve(new Error('Blog not found'));
      
      const blog = await this.blogModel.update(id, {
        title,
        short_description: shortDescription,
        app_category: appCategory,
        blog_category: blogCategory,
        mainBanner,
        status: this.getStatusEnum(status) ? this.getStatusEnum(status) : StatusEnum.SCHEDULE,
        description,
        publishedAt
      });
      
      return resolve(blog);
    })
  }

  rmBlog(id: string): Promise<DeleteResult | Error> {
    return new Promise(async (resolve, reject) => {
      const findBlog = await this.blogModel.findOne({ where: { id: parseInt(id, 10) } });
      if(!findBlog) return resolve(new Error('Blog not found'));
      const blog = await this.blogModel.update(id, { status: StatusEnum.DELETE });
      return resolve(blog);
    })
  }

  // Blog Filteration

  filterByApp(app: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const findApp = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :app", {app}).getOne();
      if(!findApp) return resolve(new Error(`App Category not found`));

      const blogs = await this.blogModel.createQueryBuilder("Blog").where("app_category->>'id' = :app", {app}).getMany();
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlog(blog: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.createQueryBuilder("Blog").where("blog_category->>'id' = :blog", {blog}).getMany();
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByStatus(status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const findStatus = this.getStatusEnum(status);
      if(!findStatus) return resolve(new Error(`Status not available`));

      const blogs = await this.blogModel.find({ where: { status: this.getStatusEnum(status) } });
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlogApp(blog: string, app: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const findBlog = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :blog", {blog}).getOne();
      const findApp = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :app", {app}).getOne();
      if(!findApp || !findBlog) return resolve(new Error(`${!findApp ? 'App' : 'Blog'} Category not found`));

      const blogs = await this.blogModel.createQueryBuilder("Blog")
      .where("app_category->>'id' = :app", {app})
      .andWhere("blog_category->>'id' = :blog", {blog})
      .getMany();
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlogStatus(blog: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const findBlog = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :blog", {blog}).getOne();
      const findStatus = this.getStatusEnum(status);
      if(!findBlog || !findStatus) return resolve(new Error(!findBlog ? "Blog Category not found" : "Status not available"));

      const blogs = await this.blogModel.createQueryBuilder("Blog")
      .andWhere("blog_category->>'id' = :blog", {blog})
      .andWhere("status = :status", {status: this.getStatusEnum(status)})
      .getMany();
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByAppStatus(app: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const findApp = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :app", {app}).getOne();
      const findStatus = this.getStatusEnum(status);
      if(!findApp || !findStatus) return resolve(new Error(!findApp ? "App Category not found" : "Status not available"));

      const blogs = await this.blogModel.createQueryBuilder("Blog")
      .andWhere("app_category->>'id' = :app", {app})
      .andWhere("status = :status", {status: this.getStatusEnum(status)})
      .getMany();
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByAppBlogStatus(app: string, blog: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const findApp = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :app", {app}).getOne();
      const findBlog = await this.categoryModel.createQueryBuilder("Category").where("category->>'id' = :blog", {blog}).getOne();
      const findStatus = this.getStatusEnum(status);
      if(!findBlog || !findStatus || !findApp) return resolve(new Error((!findBlog || !findApp) ? `${!findApp ? 'App' : 'Blog'} Category not found` : "Status not available"));

      const blogs = await this.blogModel.createQueryBuilder("Blog")
      .andWhere("blog_category->>'id' = :blog", {blog})
      .andWhere("app_category->>'id' = :app", {app})
      .andWhere("status = :status", {status: this.getStatusEnum(status)})
      .getMany();
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  private getStatusEnum(status: string): StatusEnum {
    switch (status.toLowerCase()) {
      case 'active':
        return StatusEnum.ACTIVE;
      case 'inactive':
        return StatusEnum.IN_ACTIVE;
      case 'delete':
        return StatusEnum.DELETE;
      case 'inreview':
        return StatusEnum.IN_REVIEW;
      case 'schedule': 
        return StatusEnum.SCHEDULE;
      default:
        return undefined;
    }
  }
}
