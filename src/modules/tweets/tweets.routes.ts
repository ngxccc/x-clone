import { Router } from "express";
import type { TweetController } from "./tweets.controllers";
import type { AuthMiddleware } from "../auth";
import { validate } from "@/common/middlewares/validate.middleware";
import { TweetReqBody } from "./tweets.schemas";

export const createTweetsRouter = (
  tweetController: TweetController,
  authMiddleware: AuthMiddleware,
) => {
  const router = Router();

  router.post(
    "/",
    authMiddleware.accessTokenValidator,
    validate(TweetReqBody),
    tweetController.createTweet,
  );

  return router;
};
