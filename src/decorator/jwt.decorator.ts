import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as JWT from 'jsonwebtoken';
import { JWT_SECRET } from 'src/auth/constant';

export const Jwt = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer'))
      throw new UnauthorizedException('Unauthorized Access!');
    
    const token = header.split(' ')[1];

    const decoded: any = JWT.verify(token, JWT_SECRET);
    
    return decoded;
  },
);