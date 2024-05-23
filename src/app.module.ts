import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogSchema, Blog } from './entities/blog.entities';
import { MongoDBModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import serverConfig from './config/server.config';
import { CategoryModule } from './category/category.module';
import { AppCategory, AppCategorySchema } from './entities/appCategory.entities';
import { BlogCategory, BlogCategorySchema } from './entities/blogCategory.entities';
import { Status, StatusSchema } from './entities/status.entities';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [serverConfig]
  }),
  MongoDBModule, 
  MongooseModule.forFeature([
    { name: Blog.name, schema: BlogSchema },
    { name: AppCategory.name, schema: AppCategorySchema },
    { name: BlogCategory.name, schema: BlogCategorySchema },
    { name: Status.name, schema: StatusSchema }
  ]),
  CategoryModule,
  AuthModule
],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude(
      {
        path: 'blog',
        method: RequestMethod.GET,
      },
    ).forRoutes(AppController);
  }
}
