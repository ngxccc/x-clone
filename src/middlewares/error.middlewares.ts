/* eslint-disable @typescript-eslint/no-explicit-any */
import { isProduction } from "@/constants/config.js";
import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
import { ErrorWithStatus } from "@/utils/errors.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jwt;

const handleMongooseValidationError = (err: any) => {
  const errors: Record<string, string> = {};

  Object.keys(err.errors).forEach((key) => {
    errors[key] = err.errors[key].message;
  });

  return {
    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    message: USERS_MESSAGES.VALIDATION_DATA_ERROR,
    errors,
  };
};

const handleMongooseDuplicateKeyError = (err: any) => {
  const field = Object.keys(err.keyValue)[0];
  return {
    status: HTTP_STATUS.CONFLICT,
    message: USERS_MESSAGES.FIELD_ALREADY_EXISTS(field || "Dữ liệu"),
    errors: err.keyValue,
  };
};

const handleJwtError = (err: any) => {
  return {
    status: HTTP_STATUS.UNAUTHORIZED,
    message: USERS_MESSAGES.TOKEN_EXPIRED_OR_INVALID,
    errors: (err as Error).message,
  };
};

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
      ...(err.errors && { errors: err.errors }),
    });
  }

  if (err.name === ERROR_CODES.VALIDATION_ERROR) {
    const { status, message, errors } = handleMongooseValidationError(err);
    return res.status(status).json({ message, errors });
  }

  if (err.code === ERROR_CODES.MONGO_DUPLICATE_KEY) {
    const { status, message, errors } = handleMongooseDuplicateKeyError(err);
    return res.status(status).json({ message, errors });
  }

  if (
    err instanceof JsonWebTokenError ||
    err instanceof TokenExpiredError ||
    err instanceof NotBeforeError
  ) {
    const { status, message, errors } = handleJwtError(err);
    return res.status(status).json({ message, errors });
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

  console.error("❌ INTERNAL SERVER ERROR:", err);

  const response: any = {
    message: USERS_MESSAGES.INTERNAL_SERVER_ERROR,
  };

  if (!isProduction()) {
    response.errors = err.message;
    response.stack = err.stack;
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};
