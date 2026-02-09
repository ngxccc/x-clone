import envConfig from "@/common/config/env.js";
import logger from "@/common/utils/logger";
import { Redis } from "ioredis";

export const redisConnection = new Redis({
  host: envConfig.REDIS_HOST,
  port: envConfig.REDIS_PORT,
  username: envConfig.REDIS_USERNAME,
  password: envConfig.REDIS_PASSWORD,
  tls:
    envConfig.REDIS_HOST !== "localhost"
      ? {
          rejectUnauthorized: false, // Chấp nhận kết nối bảo mật
        }
      : undefined,
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000); // max delay is 2s
    return delay;
  },
});

redisConnection.on("connect", () => {
  logger.info("✅ Redis connected via URL!");
});

redisConnection.on("error", (err) => {
  logger.error(err, "❌ Redis connection failed:");
});
