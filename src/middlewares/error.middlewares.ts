/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENV_CONFIG } from "@/constants/config.js";
import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
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
      message: USERS_MESSAGES.INVALID_JSON_SYNTAX,
    });
  }

  if (err.name === ERROR_CODES.VALIDATION_ERROR) {
    const errors: Record<string, string> = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      message: USERS_MESSAGES.VALIDATION_DATA_ERROR,
      errors,
    });
  }

  if (err.code === ERROR_CODES.MONGO_DUPLICATE_KEY) {
    const field = Object.keys(err.keyValue)[0];

    return res.status(HTTP_STATUS.CONFLICT).json({
      message: USERS_MESSAGES.FIELD_ALREADY_EXISTS(field || ""),
      errors: err.keyValue,
    });
  }

  // Login handle error
  if (
    err.message === ERROR_CODES.EMAIL_NOT_FOUND ||
    err.message === ERROR_CODES.PASSWORD_INCORRECT
  ) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USERS_MESSAGES.LOGIN_FAILED,
      errors: { emailOrPassword: USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT },
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USERS_MESSAGES.TOKEN_EXPIRED_OR_INVALID,
      error: err.message,
    });
  }

  console.error("Internal Server Error:", err);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: USERS_MESSAGES.INTERNAL_SERVER_ERROR,
    error:
      process.env.NODE_ENV === ENV_CONFIG.DEVELOPMENT ? err.message : undefined,
  });
};
