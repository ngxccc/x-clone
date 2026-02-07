import { UPLOAD_PURPOSE } from "@/constants/enums.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import mediasService from "@/services/medias.services.js";
import type { NextFunction, Request, Response } from "express";

export const uploadTweetImageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await mediasService.uploadImage(req, UPLOAD_PURPOSE.TWEET);

    return res.json({
      message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatarController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await mediasService.uploadImage(req, UPLOAD_PURPOSE.AVATAR);

    return res.json({
      message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadCoverController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await mediasService.uploadImage(req, UPLOAD_PURPOSE.COVER);

    return res.json({
      message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await mediasService.uploadVideo(req);

    return res.json({
      message: USERS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};
