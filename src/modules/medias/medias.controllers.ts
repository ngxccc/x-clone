import { UPLOAD_PURPOSE } from "@/common/constants/enums.js";
import type { NextFunction, Request, Response } from "express";
import type { MediaService } from "./medias.services";

export class MediaController {
  public constructor(private readonly mediaService: MediaService) {}

  public uploadTweetImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.mediaService.uploadImage(
        req,
        UPLOAD_PURPOSE.TWEET,
      );

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.mediaService.uploadImage(
        req,
        UPLOAD_PURPOSE.AVATAR,
      );

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadCover = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.mediaService.uploadImage(
        req,
        UPLOAD_PURPOSE.COVER,
      );

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadVideo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.mediaService.uploadVideo(req);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
