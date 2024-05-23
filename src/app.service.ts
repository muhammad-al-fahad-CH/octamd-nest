import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose"
import { Blog, StatusEnum } from './entities/blog.entities';
import { Category } from './entities/category.entities';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  getAllBlogs(): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({});
      for(const blog of blogs) {
        const publish = Date.parse(blog.publishedAt.toISOString())
        console.log(publish, Date.now());
        if(publish < Date.now()) {
          await this.blogModel.findByIdAndUpdate<Blog>(blog._id, { status: StatusEnum.ACTIVE });
        }
      }

      if(!blogs || !blogs.length) return resolve(new Error('No blogs found'));
      return resolve(blogs);
    })
  }

  getAllBlogsbyUser(): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await this.blogModel.find({ status: StatusEnum.ACTIVE });
      if(!result || !result.length) return resolve(new Error('No blogs found'));
      return resolve(result);
    })
  }

  getBlog(id: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const blog = await this.blogModel.findById<Blog>(id).exec();
      if(!blog) return resolve(new Error('Not found'));
      return resolve(blog);
    })
  }

  createBlog(title: string, shortDescription: string, appCategory: string, blogCategory: string, mainBanner: string, status: string, description: string, publishedAt: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const blogC = await this.categoryModel.findOne<Category>({ 'category.id': blogCategory });
      const appC = await this.categoryModel.findOne<Category>({ 'category.id': appCategory });
      
      if(!blogC || !appC) return resolve(new Error(`${!blogC ? 'Blog category' : 'App category'} not found`));
      const blog = await this.blogModel.create({
        title,
        short_description: shortDescription,
        app_category: appCategory,
        blog_category: blogCategory,
        mainBanner,
        status,
        description,
        publishedAt
      });
      
      const result = await blog.save();
      return resolve(result);
    })
  }

  updateBlog(id: string, title: string, shortDescription: string, appCategory: string, blogCategory: string, mainBanner: string, status: string, description: string, publishedAt: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const blogC = await this.categoryModel.findOne<Category>({ 'category.id': blogCategory });
      const appC = await this.categoryModel.findOne<Category>({ 'category.id': appCategory });

      if(!blogC || !appC) return resolve(new Error(`${!blogC ? 'blog category' : 'App category'} not found`));

      const findBlog = await this.blogModel.findById<Blog>(id);
      if(!findBlog) return resolve(new Error('Blog not found'));
      
      const blog = await this.blogModel.findByIdAndUpdate<Blog>(id, {
        title,
        short_description: shortDescription,
        app_category: appCategory,
        blog_category: blogCategory,
        mainBanner,
        status,
        description,
        publishedAt
      });
      
      return resolve(blog);
    })
  }

  rmBlog(id: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const findBlog = await this.blogModel.findById<Blog>(id);
      if(!findBlog) return resolve(new Error('Blog not found'));
      const blog = await this.blogModel.findByIdAndDelete<Blog>(id);
      return resolve(blog);
    })
  }

  // Blog Filteration

  filterByApp(app: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({ 'app_category.id': app });
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlog(blog: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({ 'blog_category.id': blog });
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByStatus(status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({ status: status });
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlogApp(blog: string, app: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({ 'blog_category.id': blog, 'app_category.id': app });
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlogStatus(blog: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({ 'blog_category.id': blog, status: status });
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByAppStatus(app: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({ 'app_category.id': app, status: status });
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByAppBlogStatus(app: string, blog: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({ 'app_category.id': app, 'blog_category.id': blog, status: status });
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }
}
