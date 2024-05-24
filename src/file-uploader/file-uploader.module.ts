import { Module } from '@nestjs/common';
import { FileUploaderController } from './file-uploader.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [FileUploaderController],
})
export class FileUploaderModule {}