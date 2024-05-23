import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user.entities';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constant';
import { AuthHelper } from './authHelper';

@Module({
  imports: [
  MongooseModule.forFeature([
    { name: User.name, schema: UserSchema}
  ]),
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