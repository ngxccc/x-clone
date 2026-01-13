import { USERS_MESSAGES } from "@/constants/messages.js";
import mediasService from "@/services/medias.services.js";
import { NextFunction, Request, Response } from "express";

export const uploadImageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await mediasService.uploadImage(req);

    return res.json({
      message: USERS_MESSAGES.UPLOAD_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};
