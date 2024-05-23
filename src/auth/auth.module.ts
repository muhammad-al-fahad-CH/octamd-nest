import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Login, LoginSchema } from 'src/entities/login.entities';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';


@Module({
  imports: [
  MongooseModule.forFeature([
    { name: Login.name, schema: LoginSchema }
  ]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '5m' },
  })
],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})

export class AuthModule {}