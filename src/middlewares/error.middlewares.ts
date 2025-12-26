import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import { NextFunction, Request, Response } from "express";

export const defaultErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err.name === "ValidationError") {
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

  // Các lỗi không xác định (Internal Server Error)
  console.error("Internal Server Error:", err);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Lỗi server nội bộ",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
