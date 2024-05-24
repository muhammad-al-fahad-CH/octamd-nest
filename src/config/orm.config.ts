import { registerAs } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";
import { ConfigEnum } from "./index";

export default registerAs(
  ConfigEnum.TYPEORM,
  (): DataSourceOptions => ({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "OctaMD",
    synchronize: true,
    logging: false,
    entities: ["src/datasource/entities/*.ts"],
    migrations: ["src/datasource/migration/**/*.ts"],
    subscribers: ["src/datasource/subscriber/**/*.ts"],
  })
);