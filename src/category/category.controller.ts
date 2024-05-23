import { Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { CategoryDto } from 'src/dto/category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async allCategories(@Res() res: Response): Promise<Response> {
    const getAllCategories = await this.categoryService.findAll();
    if(getAllCategories instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: getAllCategories.message});
    return res.status(HttpStatus.OK).json({success: true, getAllCategories});
  }

  @Post()
  async createCategory(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { appTitle, blogTitle, appId } = req.body as CategoryDto;
    const category = await this.categoryService.createCategory(appTitle, blogTitle, appId);
    if(category instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: category.message});
    return res.status(HttpStatus.OK).json({success: true, category});
  }
}