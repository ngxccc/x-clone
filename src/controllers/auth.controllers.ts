import { NextFunction, Request, Response } from "express";
import {
  LoginGoogleBodyType,
  RegisterBodyType,
} from "@/schemas/auth.schemas.js";
import usersService from "@/services/users.services.js";
import authService from "@/services/auth.services.js";
import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import "dotenv/config";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const deviceInfo = req.headers["user-agent"];

    const result = await authService.login(email, password, deviceInfo);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as RegisterBodyType;

    if (await usersService.checkEmailExist(email)) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    const newUser = await usersService.register(req.body);

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

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.LOGOUT_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.decodedEmailVerifyToken!;

    await authService.verifyEmail(userId);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.resendVerificationEmail(req.body);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.CHECK_EMAIL_TO_VERIFY,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.forgotPassword(req.body);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body;
    const { userId } = req.decodedForgotPasswordToken!;

    await authService.resetPassword(userId, password);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.PASSWORD_RESET_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    const { userId } = req.decodedRefreshToken!;
    const deviceInfo = req.headers["user-agent"];

    const result = await authService.refreshToken(
      userId,
      refreshToken,
      deviceInfo,
    );

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginGoogleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code } = req.body as LoginGoogleBodyType;
    const deviceInfo = req.headers["user-agent"];

    const result = await authService.loginGoogle(code, deviceInfo);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.LOGIN_WITH_GOOGLE_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};
