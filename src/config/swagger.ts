export interface ISwaggerConfig {
    title: string;
    description: string;
    version: string;
    path: string;
  }
  
  export enum SwaggerConfigEnum {
    TITLE = 'title',
    DESCRIPTION = 'description',
    VERSION = 'version',
    PATH = "path"
  }