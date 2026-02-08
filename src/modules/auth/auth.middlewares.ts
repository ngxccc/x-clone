import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import type { RefreshTokenRequest } from "@/common/types/request.types";
import { UnauthorizedError } from "@/common/utils/errors.js";
import { verifyToken } from "@/common/utils/jwt.js";
import type { NextFunction, Request, Response } from "express";
import RefreshToken from "./models/RefreshToken.js";
import type { UserService } from "../users/users.services.js";

export class AuthMiddleware {
  constructor(private readonly userService: UserService) {}

  accessTokenValidator = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
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

  refreshTokenValidator = async (
    req: RefreshTokenRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken)
      throw new UnauthorizedError(USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED);

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

  emailVerifyTokenValidator = async (
    req: Request<object, object, { emailVerifyToken: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { emailVerifyToken } = req.body;

    try {
      const decoded = verifyToken(emailVerifyToken, "email");
      const user =
        await this.userService.findUserByEmailVerifyToken(emailVerifyToken);

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_USED_OR_NOT_EXIST,
        });
      }

      req.decodedEmailVerifyToken = { ...decoded, userId: user.id };

      next();
    } catch (error) {
      next(error);
    }
  };

  forgotPasswordTokenValidator = async (
    req: Request<object, object, { forgotPasswordToken: string }>,
    _res: Response,
    next: NextFunction,
  ) => {
    const { forgotPasswordToken } = req.body;

    try {
      const decoded = verifyToken(forgotPasswordToken, "forgotPassword");
      const user =
        await this.userService.findUserByForgotPasswordToken(
          forgotPasswordToken,
        );

      if (!user)
        throw new UnauthorizedError(
          USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID_OR_EXPIRED,
        );

      req.decodedForgotPasswordToken = { ...decoded, userId: user.id };

      next();
    } catch (error) {
      next(error);
    }
  };

  isUserLoggedInValidator = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) return next();

    try {
      const token = authHeader.split(" ")[1]!;
      const decoded = verifyToken(token, "access");
      req.decodedAccessToken = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
}
