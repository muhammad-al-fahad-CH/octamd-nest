import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { auth } from 'src/types/auth';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async AuthorizeAdmin(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { email, password }: auth = req.body;
    const result = await this.authService.login(email, password);
    if(result instanceof Error) return res.status(HttpStatus.NOT_FOUND).json({success: false, message: result.message});
    return res.status(HttpStatus.OK).json({success: true, admin: result.admin, token: result.token});
  }
}