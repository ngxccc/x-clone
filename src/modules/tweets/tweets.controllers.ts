import type { NextFunction, Request, Response } from "express";
import type { TweetBodyType } from "./tweets.schemas";
import type { TweetService } from "./tweets.services";
import { HTTP_STATUS } from "@/common/constants/httpStatus";
import { USERS_MESSAGES } from "@/common/constants/messages";

export class TweetController {
  public constructor(private readonly tweetService: TweetService) {}

  public createTweet = async (
    req: Request<object, object, TweetBodyType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.decodedAccessToken!;

      const payload = req.body;

      const result = await this.tweetService.createTweet(userId, payload);

      res.status(HTTP_STATUS.CREATED).json({
        message: USERS_MESSAGES.CREATE_POST_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };
}
