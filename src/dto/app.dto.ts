import { IsArray, IsDefined, IsNotEmpty, IsObject, IsString } from "class-validator"
import { IsFile } from "nestjs-form-data"
import { Files } from "src/types/blog"

export class AppDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    shortDescription: string

    @IsString()
    @IsNotEmpty()
    appCategory: string

    @IsString()
    @IsNotEmpty()
    blogCategory: string

    @IsString()
    @IsNotEmpty()
    status: string

    @IsArray()
    @IsNotEmpty()
    mainBanner: Files[]

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    publishedAt: string

    @IsFile()
    @IsDefined()
    file: any
}