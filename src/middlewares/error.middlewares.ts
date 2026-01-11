/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig, { ENV_CONFIG } from "@/constants/config.js";
import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
import { ErrorWithStatus } from "@/utils/errors.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const { JsonWebTokenError } = jwt;

export const defaultErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Xử lý ErrorWithStatus
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.errorCode && { errorCode: err.errorCode }),
    });
  }

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

  if (err instanceof JsonWebTokenError) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USERS_MESSAGES.TOKEN_EXPIRED_OR_INVALID,
      errors: err.message,
    });
  }

  console.error("Internal Server Error:", err);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: USERS_MESSAGES.INTERNAL_SERVER_ERROR,
    errors:
      envConfig.NODE_ENV === ENV_CONFIG.DEVELOPMENT
        ? { errors: err.message, stack: err.stack }
        : undefined,
  });
};
