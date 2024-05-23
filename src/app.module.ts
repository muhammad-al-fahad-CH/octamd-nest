import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogSchema, Blog } from './entities/blog.entities';
import { MongoDBModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import serverConfig from './config/server.config';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { Category, CategorySchema } from './entities/category.entities';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [serverConfig]
  }),
  MongoDBModule, 
  MongooseModule.forFeature([
    { name: Blog.name, schema: BlogSchema },
    { name: Category.name, schema: CategorySchema },
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
