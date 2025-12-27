import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import { RefreshToken } from "@/models.js";
import usersService from "@/services/users.services.js";
import { verifyToken } from "@/utils/jwt.js";
import { NextFunction, Request, Response } from "express";

export const accessTokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED });
  }

  const token = authHeader.split(" ")[1]!;

  try {
    const decoded = verifyToken(token, "access");

    // Gán thông tin user vào req để dùng ở Controller sau
    req.decodedAccessToken = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export const refreshTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.body;

  try {
    const decoded = verifyToken(refreshToken, "refresh");
    const foundToken = await RefreshToken.findOne({ token: refreshToken });

    if (!foundToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.REFRESH_TOKEN_IS_USED_OR_NOT_EXIST,
      });
    }

    // Gán thông tin user vào req để dùng ở Controller sau
    req.decodedRefreshToken = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export const emailVerifyTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { emailVerifyToken } = req.body;

  try {
    const decoded = verifyToken(emailVerifyToken, "email");
    const foundToken =
      await usersService.findUserByEmailVerifyToken(emailVerifyToken);

    if (!foundToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_USED_OR_NOT_EXIST,
      });
    }

    req.decodedEmailVerifyToken = { ...decoded, userId: foundToken.id };

    next();
  } catch (error) {
    next(error);
  }
};
