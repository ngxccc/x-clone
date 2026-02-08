import type { NextFunction, Request, Response } from "express";
import type {
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginGoogleBodyType,
  RegisterBodyType,
  ResendVerificationEmailBodyType,
  ResetPasswordBodyType,
} from "./auth.schemas.js";
import type { AuthService } from "./auth.services.js";
import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import ms from "ms";
import "dotenv/config";
import envConfig, { isProduction } from "@/common/config/env.js";
import type { RefreshTokenRequest } from "@/common/types/request.types";
import type { UserService } from "../users/users.services.js";

export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  login = async (
    req: Request<object, object, LoginBodyType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;
      const deviceInfo = req.headers["user-agent"];

      const { accessToken, refreshToken } = await this.authService.login(
        email,
        password,
        deviceInfo,
      );

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true, // Chặn JS đọc
        secure: isProduction, // https
        sameSite: "strict", // Chống CSRF
        maxAge: ms(envConfig.JWT_REFRESH_EXPIRES_IN),
      });

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.LOGIN_SUCCESS,
        result: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  };

  register = async (
    req: Request<object, object, RegisterBodyType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;

      if (await this.userService.checkEmailExist(email)) {
        return res
          .status(HTTP_STATUS.CONFLICT)
          .json({ message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS });
      }

      const newUser = await this.userService.register(req.body);

      // TODO: Sẽ gửi mail cho user
      console.log(newUser.emailVerifyToken);

      return res.status(HTTP_STATUS.CREATED).json({
        message: USERS_MESSAGES.REGISTER_SUCCESS,
        result: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          dateOfBirth: newUser.dateOfBirth,
        },
      });
    } catch (error) {
      // Đẩy toàn bộ lỗi sang defaultErrorHandler xử lý
      next(error);
    }
  };

  logout = async (
    req: RefreshTokenRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshToken = req.cookies.refresh_token;

      await this.authService.logout(refreshToken);

      res.clearCookie("refresh_token");

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decodedEmailVerifyToken!;

      await this.authService.verifyEmail(userId);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

  resendVerificationEmail = async (
    req: Request<object, object, ResendVerificationEmailBodyType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.authService.resendVerificationEmail(req.body);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.CHECK_EMAIL_TO_VERIFY,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    req: Request<object, object, ForgotPasswordBodyType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.authService.forgotPassword(req.body);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request<object, object, ResetPasswordBodyType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { password } = req.body;
      const { userId } = req.decodedForgotPasswordToken!;

      await this.authService.resetPassword(userId, password);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.PASSWORD_RESET_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: RefreshTokenRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshTokenCookie = req.cookies.refresh_token;
      const { userId } = req.decodedRefreshToken!;
      const deviceInfo = req.headers["user-agent"];

      const { accessToken, refreshToken } = await this.authService.refreshToken(
        userId,
        refreshTokenCookie,
        deviceInfo,
      );

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true, // Chặn JS đọc
        secure: isProduction, // https
        sameSite: "strict", // Chống CSRF
        maxAge: ms(envConfig.JWT_REFRESH_EXPIRES_IN),
      });

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
        result: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  };

  loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body as LoginGoogleBodyType;
      const deviceInfo = req.headers["user-agent"];

      const { accessToken, refreshToken } = await this.authService.loginGoogle(
        code,
        deviceInfo,
      );

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true, // Chặn JS đọc
        secure: isProduction, // https
        sameSite: "strict", // Chống CSRF
        maxAge: ms(envConfig.JWT_REFRESH_EXPIRES_IN),
      });

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.LOGIN_WITH_GOOGLE_SUCCESS,
        result: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  };
}
