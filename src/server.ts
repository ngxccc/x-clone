import app from "./app.js";
import { initFolder } from "@/common/utils/file.js";
import logger from "@/common/utils/logger.js";
import { setServers } from "node:dns/promises";
import envConfig from "./common/config/env.js";
import type { Server } from "node:http";
import { databaseService, videoWorker } from "./container.js";

const port = envConfig.PORT;

// fix resolve dns querySrv ECONNREFUSED
setServers(["1.1.1.1"]);

let httpServer: Server;

const startServer = async () => {
  try {
    initFolder();

    videoWorker.init();

    await databaseService.connect();

    httpServer = app.listen(port, () => {
      logger.info(`🚀 Server is running at http://localhost:${port}`);
      logger.info(`Environment: ${envConfig.NODE_ENV}`);
    });
  } catch (error) {
    logger.error(error, "❌ Unable to start server:");
    process.exit(1);
  }
};

void startServer();

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // Đóng HTTP Server (Không nhận request mới)
  if (httpServer) {
    httpServer.close(() => {
      logger.info("HTTP Server closed.");
    });
  }

  // Đóng Worker (Chờ xử lý nốt job đang dang dở nếu có logic đó)
  if (videoWorker) {
    await videoWorker.close();
    logger.info("VideoWorker closed.");
  }

  logger.info("👋 Server shutdown complete.");
  process.exit(0);
};

// Bắt sự kiện tắt server
process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => void gracefulShutdown("SIGINT"));
