import {
  uploadAvatarController,
  uploadCoverController,
  uploadTweetImageController,
  uploadVideoController,
} from "./medias.controllers.js";
import { accessTokenValidator } from "@/modules/auth";
import { Router } from "express";

const mediasRouter = Router();

mediasRouter.post(
  "/upload-tweet-image",
  accessTokenValidator,
  uploadTweetImageController,
);

mediasRouter.post(
  "/upload-avatar",
  accessTokenValidator,
  uploadAvatarController,
);

mediasRouter.post("/upload-cover", accessTokenValidator, uploadCoverController);

mediasRouter.post("/upload-video", accessTokenValidator, uploadVideoController);

export default mediasRouter;
