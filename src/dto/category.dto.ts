import { IsString } from "class-validator"

export class CategoryDto {
    @IsString()
    appTitle?: string

    @IsString()
    blogTitle?: string

    @IsString()
    appId?: string
}