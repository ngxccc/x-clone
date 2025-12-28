import { NextFunction, Request, Response } from "express";
import { RegisterReqType } from "@/schemas/auth.schemas.js";
import usersService from "@/services/users.services.js";
import authService from "@/services/auth.services.js";
import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.login(req.body, req.headers["user-agent"]);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      data: result,
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
    const { email } = req.body as RegisterReqType;

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
      data: {
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
    await authService.logout(req.body);

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
    await authService.verifyEmail(req.decodedEmailVerifyToken!.userId);

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
    await authService.resetPassword(req.body);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.PASSWORD_RESET_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};
