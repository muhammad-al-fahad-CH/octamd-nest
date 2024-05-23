export interface IServerConfig {
  port: number;
  prefix: string;
}
  
export enum ServerConfigEnum {
  PORT = 'port',
  PREFIX = 'prefix',
}