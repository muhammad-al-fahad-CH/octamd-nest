import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response, Request } from 'express'
import { IAppCategory } from 'src/types/appCategory';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async allCategories(@Res() res: Response): Promise<Response> {
    const getAllCategories = await this.categoryService.getCategories();
    if(getAllCategories instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: getAllCategories.message});
    return res.status(HttpStatus.OK).json({success: true, getAllCategories});
  }

  // App Category

  @Get('app')
  async getAppCategories(@Res() res: Response): Promise<Response> {
    const categories = await this.categoryService.getAppCategories();
    if(categories instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: categories.message});
    return res.status(HttpStatus.OK).json({success: true, categories});
  }

  @Post('app')
  async createAppCategory(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { name, blog }: IAppCategory = req.body;
    const newCategory = await this.categoryService.createAppCategory(name, blog);
    return res.status(HttpStatus.OK).json({success: true, newCategory});
  }

  @Put('app/:id')
  async putAppCategorie(@Param('id') id: string, @Req() req: Request, @Res() res: Response): Promise<Response> {
    const { name, blog }: IAppCategory = req.body;
    const updateCategory = await this.categoryService.putAppCategorie(id, name, blog);
    if(updateCategory instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: updateCategory.message});
    return res.status(HttpStatus.OK).json({success: true, updateCategory});
  }

  @Delete('app/:id')
  async rmAppCategorie(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const deleteCategory = await this.categoryService.rmAppCategorie(id);
    if(deleteCategory instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: deleteCategory.message});
    return res.status(HttpStatus.OK).json({success: true, deleteCategory});
  }

  // Blog Category

   @Get('app/:id')
  async getBlogByAppNameCategories(@Param('id') app: string, @Res() res: Response): Promise<Response> {
    const categories = await this.categoryService.getBlogByAppNameCategories(app);
    if(categories instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: categories.message});
    return res.status(HttpStatus.OK).json({success: true, categories});
  }

  @Get('blog')
  async getBlogCategories(@Res() res: Response): Promise<Response> {
    const categories = await this.categoryService.getBlogCategories();
    if(categories instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: categories.message});
    return res.status(HttpStatus.OK).json({success: true, categories});
  }

  @Post('blog')
  async createBlogCategory(@Body('name') category: string, @Body('app') app: string, @Res() res: Response): Promise<Response> {
    const newCategory = await this.categoryService.createBlogCategory(category, app);
    return res.status(HttpStatus.OK).json({success: true, newCategory});
  }

  @Put('blog/:id')
  async putBlogCategorie(@Param('id') id: string, @Body('name') category: string, @Res() res: Response): Promise<Response> {
    const updateCategory = await this.categoryService.putBlogCategorie(id, category);
    if(updateCategory instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: updateCategory.message});
    return res.status(HttpStatus.OK).json({success: true, updateCategory});
  }

  @Delete('blog/:id')
  async rmBlogCategorie(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const deleteCategory = await this.categoryService.rmBlogCategorie(id);
    if(deleteCategory instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: deleteCategory.message});
    return res.status(HttpStatus.OK).json({success: true, deleteCategory});
  }


  // Status

  @Get('status')
  async getStatus(@Res() res: Response): Promise<Response> {
    const status = await this.categoryService.getStatus();
    if(status instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: status.message});
    return res.status(HttpStatus.OK).json({success: true, status});
  }

  @Post('status')
  async createStatus(@Body('name') status: string, @Res() res: Response): Promise<Response> {
    const newStatus = await this.categoryService.createStatus(status);
    return res.status(HttpStatus.OK).json({success: true, newStatus});
  }

  @Put('status/:id')
  async putStatus(@Param('id') id: string, @Body('name') status: string, @Res() res: Response): Promise<Response> {
    const updateStatus = await this.categoryService.putStatus(id, status);
    if(updateStatus instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: updateStatus.message});
    return res.status(HttpStatus.OK).json({success: true, updateStatus});
  }

  @Delete('portal/:id')
  async rmStatus(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const deleteStatus = await this.categoryService.rmStatus(id);
    if(deleteStatus instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: deleteStatus.message});
    return res.status(HttpStatus.OK).json({success: true, deleteStatus});
  }
}