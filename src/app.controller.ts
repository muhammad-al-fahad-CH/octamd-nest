import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from "express"
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './config/multer.config';
import { inputBlog } from './types/blog';
import { queryBlog } from './types/filter';
import { Blog } from './entities/blog.entities';
import { AppDto } from './dto/app.dto';

@Controller('blog')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getBlogs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const { app, blog, status }: queryBlog = req.query;
      let blogs: Blog[] | Error = [];

      if(app && blog && status) {
        blogs = await this.appService.filterByAppBlogStatus(app, blog, status);
      } else if(app && blog) {
        blogs = await this.appService.filterByBlogApp(blog, app);
      } else if(blog && status) {
        blogs = await this.appService.filterByBlogStatus(blog, status);
      } else if(app && status) {
        blogs = await this.appService.filterByAppStatus(app, status);
      } else if(app) {
        blogs = await this.appService.filterByApp(app);
      } else if(blog) {
        blogs = await this.appService.filterByBlog(blog);
      } else if(status) {
        blogs = await this.appService.filterByStatus(status);
      } else {
        blogs = await this.appService.getAllBlogsbyUser();
      }

      if(blogs instanceof Error) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: blogs.message
        });
      }

      const timestamp = Date.parse('2024-05-23T05:35:00.000Z');
      const currentTimeStamp = Date.now();

      return Promise.resolve(res.status(HttpStatus.OK).json({
        success: true,
        blogs,
        timestamp,
        currentTimeStamp
      }));
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('admin')
  async getBlogsbyAdmin(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const { app, blog, status }: queryBlog = req.query;
      let blogs: Blog[] | Error = [];

      if(app && blog && status) {
        blogs = await this.appService.filterByAppBlogStatus(app, blog, status);
      } else if(app && blog) {
        blogs = await this.appService.filterByBlogApp(blog, app);
      } else if(blog && status) {
        blogs = await this.appService.filterByBlogStatus(blog, status);
      } else if(app && status) {
        blogs = await this.appService.filterByAppStatus(app, status);
      } else if(app) {
        blogs = await this.appService.filterByApp(app);
      } else if(blog) {
        blogs = await this.appService.filterByBlog(blog);
      } else if(status) {
        blogs = await this.appService.filterByStatus(status);
      } else {
        blogs = await this.appService.getAllBlogs();
      }

      if(blogs instanceof Error) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: blogs.message
        });
      }

      return Promise.resolve(res.status(HttpStatus.OK).json({
        success: true,
        blogs
      }));
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getBlog(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    try {
      const blog = await this.appService.getBlog(id);

      if(blog instanceof Error) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: blog.message
        });
      }

      return Promise.resolve(res.status(HttpStatus.OK).json({
        success: true,
        blog
      }));
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createBlog(
    @Req() req: AppDto,
    @UploadedFile() file: AppDto['file'],
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { title, shortDescription, appCategory, blogCategory, status, description, scheduleDate }: inputBlog = req;
      const mainBanner = `${process.env.API_URL}/${file.path}`;
      const blog = await this.appService.createBlog(title, shortDescription, appCategory, blogCategory, mainBanner, status, description, scheduleDate);
      if(blog instanceof Error) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: blog.message
        });
      }
      return Promise.resolve(res.status(HttpStatus.OK).json({
        success: true,
        blog
      }));
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateBlog(
    @Param('id') id: string,
    @Req() req: Request,
    @UploadedFile() file: any,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { title, shortDescription, appCategory, blogCategory, status, description, scheduleDate }: inputBlog = req.body;
      const mainBanner = `${process.env.API_URL}/${file.path}`;
      const blog = await this.appService.updateBlog(id, title, shortDescription, appCategory, blogCategory, mainBanner, status, description, scheduleDate);
      if(blog instanceof Error) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: blog.message
        });
      }

      return Promise.resolve(res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog updated successfully',
      }));
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    try {
      const blog = await this.appService.rmBlog(id);
      if(blog instanceof Error) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: blog.message
        });
      }

      return Promise.resolve(res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog deleted successfully',
      }));
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
