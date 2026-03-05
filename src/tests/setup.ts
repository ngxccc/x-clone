import logger from "@/common/utils/logger";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);
logger.info("🛠️ [Test Setup]: Zod extended with OpenAPI successfully.");
