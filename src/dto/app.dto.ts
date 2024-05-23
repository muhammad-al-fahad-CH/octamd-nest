import { IsDefined, IsNotEmpty, IsString } from "class-validator"
import { IsFile } from "nestjs-form-data"

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

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    scheduleDate: string

    @IsFile()
    @IsDefined()
    file: any
}