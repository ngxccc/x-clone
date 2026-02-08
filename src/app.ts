import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from "@/common/constants/dir.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import envConfig from "@/common/config/env.js";
import { NotFoundError } from "@/common/utils/errors.js";
import { defaultErrorHandler } from "@/common/middlewares/error.middlewares.js";
import { usersRouter } from "@/modules/users";
import { mediasRouter } from "@/modules/medias";
import { authRouter } from "./modules/auth";

const app = express();

// Global Middlewares
app.use(compression());
app.use(cookieParser());
app.use(express.json());
// Bỏ qua lớp trung gian (Cloudflare / Nginx) để rate limit đúng IP
app.set("trust proxy", 1);

// Cấu hình CORS
app.use(
  cors({
    origin: envConfig.CLIENT_URL,
    credentials: true,
  }),
);

// Routes Definition
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/media", mediasRouter);

// Serve static file
app.use("/static/image", express.static(UPLOAD_IMAGE_DIR));
app.use("/static/video", express.static(UPLOAD_VIDEO_DIR));

// Route -> 404 -> Error Handler
// Error Handling
app.use((_req, _res, next) => {
  next(new NotFoundError(USERS_MESSAGES.API_ENDPOINT_NOT_FOUND));
});

app.use(defaultErrorHandler);

export default app;
