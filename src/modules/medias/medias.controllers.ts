import { UPLOAD_PURPOSE } from "@/common/constants/enums.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import type { NextFunction, Request, Response } from "express";
import type { MediaService } from "./medias.services";

export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  uploadTweetImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.mediaService.uploadImage(
        req,
        UPLOAD_PURPOSE.TWEET,
      );

      return res.json({
        message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.mediaService.uploadImage(
        req,
        UPLOAD_PURPOSE.AVATAR,
      );

      return res.json({
        message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadCover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.mediaService.uploadImage(
        req,
        UPLOAD_PURPOSE.COVER,
      );

      return res.json({
        message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.mediaService.uploadVideo(req);

      return res.json({
        message: USERS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };
}
