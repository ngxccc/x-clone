import type { NextFunction, Request, Response } from "express";
import type { TweetBodyType } from "./tweets.schemas";
import type { TweetService } from "./tweets.services";
import { HTTP_STATUS } from "@/common/constants/httpStatus";

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

      const data = await this.tweetService.createTweet(userId, payload);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
