import { ConfigEnum } from "./index";
import { registerAs } from "@nestjs/config";

export default registerAs(ConfigEnum.SERVER, () => ({
  port: parseInt(process.env.BACKEND_APP_PORT) || 5000,
  prefix: process.env.ENDPOINT_PREFIX || "api",
}));