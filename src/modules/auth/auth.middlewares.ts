import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import type { RefreshTokenRequest } from "@/common/types/request.types";
import type { NextFunction, Request, Response } from "express";
import RefreshToken from "./models/RefreshToken.js";
import type { UserService } from "../users/users.services.js";
import type { TokenService } from "@/common/utils/jwt.js";
import { ERROR_CODES } from "@/common/constants/error-codes.js";

export class AuthMiddleware {
  public constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public accessTokenValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.setHeader("WWW-Authenticate", "Bearer");

      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.AUTH.MISSING_BEARER_TOKEN,
        },
      });
    }

    const token = authHeader.split(" ")[1]!;

    try {
      const decoded = this.tokenService.verifyToken(token, "access");

      // Gán thông tin user vào req để dùng ở Controller sau
      req.decodedAccessToken = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };

  public refreshTokenValidator = async (
    req: RefreshTokenRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken)
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: { code: ERROR_CODES.AUTH.MISSING_REFRESH_TOKEN },
      });

    try {
      const decoded = this.tokenService.verifyToken(refreshToken, "refresh");
      const foundToken = await RefreshToken.findOne({ token: refreshToken });

      if (!foundToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: {
            code: ERROR_CODES.AUTH.MISSING_REFRESH_TOKEN,
          },
        });
      }

      // Gán thông tin user vào req để dùng ở Controller sau
      req.decodedRefreshToken = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };

  public emailVerifyTokenValidator = async (
    req: Request<object, object, { emailVerifyToken: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { emailVerifyToken } = req.body;

    try {
      const decoded = this.tokenService.verifyToken(emailVerifyToken, "email");
      const user =
        await this.userService.findUserByEmailVerifyToken(emailVerifyToken);

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: { code: ERROR_CODES.AUTH.INVALID_EMAIL_VERIFY_TOKEN },
        });
      }

      req.decodedEmailVerifyToken = { ...decoded, userId: user.id };

      next();
    } catch (error) {
      next(error);
    }
  };

  public forgotPasswordTokenValidator = async (
    req: Request<object, object, { forgotPasswordToken: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { forgotPasswordToken } = req.body;

    try {
      const decoded = this.tokenService.verifyToken(
        forgotPasswordToken,
        "forgotPassword",
      );
      const user =
        await this.userService.findUserByForgotPasswordToken(
          forgotPasswordToken,
        );

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: { code: ERROR_CODES.AUTH.INVALID_FORGOT_PASSWORD_TOKEN },
        });
      }

      req.decodedForgotPasswordToken = { ...decoded, userId: user.id };

      next();
    } catch (error) {
      next(error);
    }
  };

  public isUserLoggedInValidator = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) return next();

    try {
      const token = authHeader.split(" ")[1]!;
      const decoded = this.tokenService.verifyToken(token, "access");
      req.decodedAccessToken = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
}
