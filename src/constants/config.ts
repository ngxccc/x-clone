import { config } from "dotenv";
import fs from "fs";
import path from "path";
import z from "zod";
import { USERS_MESSAGES } from "./messages.js";
import { StringValue } from "ms";

export const ENV_CONFIG = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
} as const;

const MsDuration = z.custom<StringValue>((val) => {
  if (typeof val !== "string") return false;

  // - ^(?:\d+)?\.?\d+ : Số nguyên hoặc số thập phân (VD: 10, 0.5, .5)
  // - * : Khoảng trắng tùy chọn
  // - (...)? : Phần đơn vị (tùy chọn, vì '100' cũng là hợp lệ theo type StringValue)
  // - i : Case insensitive (không phân biệt hoa thường)
  const pattern =
    /^(?:\d+)?\.?\d+ *(?:years?|yrs?|y|weeks?|w|days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s|milliseconds?|msecs?|ms)?$/i;

  return pattern.test(val);
}, USERS_MESSAGES.INVALID_TIME_STRING);

config({
  path: path.resolve(".env"),
});

const checkEnv = async () => {
  if (!fs.existsSync(path.resolve(".env"))) {
    console.error(USERS_MESSAGES.DOTENV_FILE_NOT_FOUND);
    process.exit(1);
  }
};
checkEnv();

const configSchema = z.object({
  // --- Server Basic ---
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  // --- Database ---
  MONGO_URI: z.string(USERS_MESSAGES.MONGO_URI_IS_REQUIRED),

  // --- JWT Secret & Expiration ---
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: MsDuration.default("15m"),

  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: MsDuration.default("100d"),

  JWT_EMAIL_VERIFY_SECRET: z.string(),
  JWT_EMAIL_VERIFY_EXPIRES_IN: MsDuration.default("10m"),

  JWT_FORGOT_PASSWORD_SECRET: z.string(),
  JWT_FORGOT_PASSWORD_EXPIRES_IN: MsDuration.default("10m"),

  // --- Google OAuth ---
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),

  // --- Client URL (cho CORS) ---
  CLIENT_URL: z.string().default("http://localhost:3000"),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.error(USERS_MESSAGES.DOTENV_FILE_CONFIG_INVALID);
  configServer.error.issues.forEach((issue) => {
    console.error(` - ${issue.path.join(".")}: ${issue.message}`);
  });
  throw new Error(USERS_MESSAGES.DOTENV_CONFIG_ERROR);
}

const envConfig = configServer.data;
export default envConfig;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
