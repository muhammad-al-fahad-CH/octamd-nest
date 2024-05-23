import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose"
import { Blog } from './entities/blog.entities';
import { AppCategory } from './entities/appCategory.entities';
import { BlogCategory } from './entities/blogCategory.entities';
import { Status } from './entities/status.entities';
import { Cron, CronExpression  } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(AppCategory.name) private readonly appModel: Model<AppCategory>,
    @InjectModel(BlogCategory.name) private readonly blogCModel: Model<BlogCategory>,
    @InjectModel(Status.name) private readonly statusModel: Model<Status>,
  ) {}
  getAllBlogs(): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({});
      if(!blogs || !blogs.length) return resolve(new Error('No blogs found'));
      return resolve(blogs);
    })
  }

  getAllBlogsbyUser(): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const activeStatus = await this.statusModel.findOne({name: 'active'});
      const blogs = await this.blogModel.find<Blog>({ status: activeStatus._id });
      if(!blogs || !blogs.length) return resolve(new Error('No blogs found'));
      return resolve(blogs);
    })
  }

  getBlog(id: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const blog = await this.blogModel.findById<Blog>(id).exec();
      if(!blog) return resolve(new Error('Not found'));
      return resolve(blog);
    })
  }

  createBlog(title: string, shortDescription: string, appCategory: string, blogCategory: string, mainBanner: string, status: string, description: string, scheduleDate: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const blogC = await this.blogCModel.findById<BlogCategory>(blogCategory);
      const appC = await this.appModel.findById<AppCategory>(appCategory);
      const statusC = await this.statusModel.findById<Status>(status);
      if(!blogC || !appC || !statusC) return resolve(new Error(`${!blogC ? 'blog category' : !appC ? 'Portal category' : 'Status'} not found`));
      const blog = await this.blogModel.create({
        title,
        short_description: shortDescription,
        app_category: appCategory,
        blog_category: blogCategory,
        mainBanner,
        status,
        description,
        scheduleDate: parseInt(scheduleDate)
      });
      
      const result = await blog.save();
      return resolve(result);
    })
  }

  updateBlog(id: string, title: string, shortDescription: string, appCategory: string, blogCategory: string, mainBanner: string, status: string, description: string, scheduleDate: string): Promise<Blog | Error> {
    return new Promise(async (resolve, reject) => {
      const blogC = await this.blogCModel.findById<BlogCategory>(blogCategory);
      const portalC = await this.appModel.findById<AppCategory>(appCategory);
      const statusC = await this.statusModel.findById<Status>(status);
      if(!blogC || !portalC || !statusC) return resolve(new Error(`${!blogC ? 'blog category' : !portalC ? 'Portal category' : 'Status'} not found`));
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
        scheduleDate: parseInt(scheduleDate)
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
      const blogs = await this.blogModel.find<Blog>({app_category: app});
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlog(blog: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({blog_category: blog});
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByStatus(status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({status: status});
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlogApp(blog: string, app: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({blog_category: blog, app_category: app});
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByBlogStatus(blog: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({blog_category: blog, status: status});
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByAppStatus(app: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({app_category: app, status: status});
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  filterByAppBlogStatus(app: string, blog: string, status: string): Promise<Blog[] | Error> {
    return new Promise(async (resolve, reject) => {
      const blogs = await this.blogModel.find<Blog>({app_category: app, blog_category: blog, status: status});
      if(!blogs) return resolve(new Error('No blog found'));
      return resolve(blogs);
    })
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'Publish Blog Test',
    timeZone: 'Asia/Karachi'
  })
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'Publish Blog',
    timeZone: 'Asia/Karachi'
  })
  async setBlogStatus() {
    this.logger.debug("setBlogStatus Function is running...");
    const blog = await this.blogModel.find<Blog>({});
    if(!blog) return;

    const activeStatus = await this.statusModel.findOne({name: 'active'})
    const publishedStatus = await this.statusModel.findOne({name: 'created'})

    for(let i = 0; i < blog.length; i++) {
      if(blog[i].scheduleDate && blog[i].status === publishedStatus._id && blog[i].scheduleDate < Date.now()){
        await this.blogModel.findByIdAndUpdate<Blog>(blog[i]._id, {
          status: activeStatus._id
        })
        this.logger.debug("Blog Scheduled: \n", blog[i]);
      }
    }
  }
}
