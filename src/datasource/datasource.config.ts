require('dotenv').config();
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/datasource/entities/*.ts'],
  migrations: ['src/datasource/migration/**/*.ts'],
  subscribers: ['src/datasource/subscriber/**/*.ts'],
});