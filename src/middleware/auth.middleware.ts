import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from 'src/auth/constant';

interface CustomRequest extends Request {
    user: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    use(req: CustomRequest, res: Response, next: NextFunction) {
        const authToken = req.headers.authorization;
        if (authToken && authToken.startsWith('Bearer ')) {
            const token = authToken.split(' ')[1];
            try {
                const decoded = this.jwtService.verify(token, {
                    secret: JWT_SECRET,
                });
                req.user = decoded;
                next();
            } catch (err) {
                throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
            }
        } else {
            throw new HttpException('Missing token', HttpStatus.BAD_REQUEST);
        }
    }
}
