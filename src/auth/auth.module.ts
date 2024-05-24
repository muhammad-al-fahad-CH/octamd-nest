import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constant';
import { AuthHelper } from './authHelper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities/user.entities';

@Module({
  imports: [
  TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: JWT_SECRET,
    signOptions: { expiresIn: 60 * 60 * 60 },
  }),
],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
  exports: [AuthHelper]
})

export class AuthModule {}