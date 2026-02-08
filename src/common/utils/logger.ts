import envConfig, { isProduction } from "@/common/config/env.js";
import pino from "pino";

const logger = pino({
  level: envConfig.LOG_LEVEL,
  transport: !isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true, // Màu mè cho dễ nhìn
          translateTime: "SYS:standard", // Format giờ dễ đọc
          ignore: "pid,hostname", // Bỏ mấy cái rác không cần thiết ở local
        },
      }
    : undefined,
});

export default logger;
