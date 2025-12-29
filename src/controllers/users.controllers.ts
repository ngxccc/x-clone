import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import usersService from "@/services/users.services.js";
import { NextFunction, Request, Response } from "express";

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.decodedAccessToken!;

    const data = await usersService.getMe(userId);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.GET_ME_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};
