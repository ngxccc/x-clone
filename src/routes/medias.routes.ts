import {
  uploadAvatarController,
  uploadCoverController,
  uploadTweetImageController,
} from "@/controllers/medias.controllers.js";
import { accessTokenValidator } from "@/middlewares/auth.middlewares.js";
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

export default mediasRouter;
