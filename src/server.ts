import app from "./app.js";
import databaseService from "@/services/database.services.js";
import { initFolder } from "@/common/utils/file.js";
import { initVideoWorker } from "@/modules/medias";
import logger from "@/common/utils/logger.js";
import { setServers } from "node:dns/promises";
import envConfig from "./common/config/env.js";

const port = envConfig.PORT;

// fix resolve dns querySrv ECONNREFUSED
setServers(["1.1.1.1"]);

const startServer = async () => {
  try {
    initFolder();
    initVideoWorker();

    await databaseService.connect();

    app.listen(port, () => {
      logger.info(`🚀 Server is running at http://localhost:${port}`);
      logger.info(`Environment: ${envConfig.NODE_ENV}`);
    });
  } catch (error) {
    logger.error(error, "❌ Unable to start server:");
    process.exit(1);
  }
};

void startServer();
