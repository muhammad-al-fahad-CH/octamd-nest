import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { ConfigEnum, IServerConfig } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // To create HTTP Server

  const logger = new Logger("Bootstrap"); // For logging in console what to print the Bootstrap function

  const configService = app.get<ConfigService>(ConfigService); // To get PORT and PREFIX from config folder where we set the configuration of all our application

  const { port: SERVER_PORT, prefix: ENDPOINT_PREFIX } = configService.get<IServerConfig>(ConfigEnum.SERVER);

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }); // To enable cross origin resource sharing where we can send data from server to client.

  app.setGlobalPrefix(ENDPOINT_PREFIX); // https://localhost:4000 normally server run on this route but we assign the additional to get routes from that route.
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(SERVER_PORT); // To set the PORT for running

  logger.log(`Application is running on: ${await app.getUrl()}`); // To show in terminal when server is successfully run
}
bootstrap();
