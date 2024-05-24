import {
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../config/multer.config";
import { Response } from "express";
import { Jwt } from "src/decorator/jwt.decorator";
import { auth } from "src/types/auth";
  
  @Controller("upload")
  export class FileUploaderController {
    @Post("file")
    @UseInterceptors(FileInterceptor("file", multerOptions))
    fileUpload(
      @Jwt() user: auth,
      @UploadedFile() file: any, 
      @Res() res: Response
    ) {
      if (!file) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }
  
      res.status(HttpStatus.OK).json({
        success: true,
        message: "File uploaded successfully",
        originalname: file.originalname,
        uniqueName: file.filename,
        url: `${process.env.API_URL}/${file.path}`,
      });
    }
  
    @Post("files")
    @UseInterceptors(FilesInterceptor("files", 10, multerOptions))
    filesUpload(
      @Jwt() user: auth,
      @UploadedFiles() files: any, 
      @Res() res: Response
    ) {
      if (!files.length) {
        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: "No file uploaded",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
          success: true,
          message: "File uploaded successfully",
          files: files.map((file: any) => ({
            originalname: file.originalname,
            uniqueName: file.filename,
            url: `${process.env.API_URL}/${file.path}`,
          })),
      });
    }
  }