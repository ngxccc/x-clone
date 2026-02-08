import type { AuthMiddleware } from "../auth/auth.middlewares.js";
import type { MediaController } from "./medias.controllers.js";
import { Router } from "express";

export const createMediasRouter = (
  mediaController: MediaController,
  authMiddleware: AuthMiddleware,
) => {
  const router = Router();

  router.post(
    "/upload-tweet-image",
    authMiddleware.accessTokenValidator,
    mediaController.uploadTweetImage,
  );

  router.post(
    "/upload-avatar",
    authMiddleware.accessTokenValidator,
    mediaController.uploadAvatar,
  );

  router.post(
    "/upload-cover",
    authMiddleware.accessTokenValidator,
    mediaController.uploadCover,
  );

  router.post(
    "/upload-video",
    authMiddleware.accessTokenValidator,
    mediaController.uploadVideo,
  );

  return router;
};
