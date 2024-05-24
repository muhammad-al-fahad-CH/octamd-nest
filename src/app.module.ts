import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import serverConfig from './config/server.config';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import typeorm from './config/orm.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './config';
import { Blog } from './datasource/entities/blog.entities';
import { Category } from './datasource/entities/category.entities';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [typeorm, serverConfig]
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) =>
      configService.get<Promise<TypeOrmModuleOptions>>(ConfigEnum.TYPEORM),
    inject: [ConfigService],
  }),
  TypeOrmModule.forFeature([Blog, Category]),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/uploads',
  }),
  CategoryModule,
  AuthModule,
  FileUploaderModule
],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
