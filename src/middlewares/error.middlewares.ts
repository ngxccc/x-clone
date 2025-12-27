/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENV_CONFIG } from "@/constants/config.js";
import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

export const defaultErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Xử lý lỗi Malformed JSON (Do express.json() throw ra)
  if (
    err instanceof SyntaxError &&
    "body" in err &&
    (err as any).status === HTTP_STATUS.BAD_REQUEST
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Dữ liệu gửi lên không đúng định dạng JSON (Syntax Error)",
    });
  }

  if (err.name === USERS_MESSAGES.VALIDATION_ERROR) {
    const errors: Record<string, string> = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      message: "Lỗi validation dữ liệu (Mongoose)",
      errors,
    });
  }

  // 11000 là mã lỗi Duplicate Key Error của MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return res.status(HTTP_STATUS.CONFLICT).json({
      message: `${field} đã tồn tại trong hệ thống`,
      errors: err.keyValue,
    });
  }

  // Login handle error
  if (
    err.message === USERS_MESSAGES.EMAIL_NOT_FOUND ||
    err.message === USERS_MESSAGES.PASSWORD_INCORRECT
  ) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: "Đăng nhập thất bại",
      errors: { emailOrPassword: "Email hoặc mật khẩu không đúng" },
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: "Token hết hạn hoặc không hợp lệ",
      error: err.message,
    });
  }

  // Các lỗi không xác định (Internal Server Error)
  console.error("Internal Server Error:", err);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Lỗi server nội bộ",
    error:
      process.env.NODE_ENV === ENV_CONFIG.DEVELOPMENT ? err.message : undefined,
  });
};
