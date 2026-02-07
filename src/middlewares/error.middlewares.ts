/* eslint-disable @typescript-eslint/no-explicit-any */
import { isProduction } from "@/constants/config.js";
import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { MongoServerError } from "mongodb";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
import { ErrorWithStatus } from "@/utils/errors.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import logger from "@/utils/logger";

const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jwt;

const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError | MongoServerError,
) => {
  const errors: Record<string, string> = {};

  if (err instanceof mongoose.Error.ValidationError) {
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key]?.message ?? "Unknow Error";
    });
  }

  if (err instanceof MongoServerError) {
    // NOTE: do chưa biết res lỗi thê nào nên chưa làm
    // TODO: map lỗi
    logger.error(err, "LỖI MongoServerError");
  }

  return {
    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    message: USERS_MESSAGES.VALIDATION_DATA_ERROR,
    errors,
  };
};

const handleMongooseDuplicateKeyError = (err: MongoServerError) => {
  const field = err.errorResponse.message;
  return {
    status: HTTP_STATUS.CONFLICT,
    message: USERS_MESSAGES.FIELD_ALREADY_EXISTS(field ?? "Dữ liệu"),
    errors: err.errInfo,
  };
};

const handleJwtError = (err: Error) => {
  return {
    status: HTTP_STATUS.UNAUTHORIZED,
    message: USERS_MESSAGES.TOKEN_EXPIRED_OR_INVALID,
    errors: err.message,
  };
};

export const defaultErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let errorResponse = null;

  // Xử lý ErrorWithStatus
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.errorCode && { errorCode: err.errorCode }),
      ...(err.errors && { errors: err.errors as Record<string, any> }),
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    errorResponse = handleMongooseValidationError(err);
  } else if (
    err instanceof MongoServerError &&
    err.code === ERROR_CODES.MONGO_DUPLICATE_KEY
  ) {
    errorResponse = handleMongooseValidationError(err);
  }

  if (errorResponse) {
    return res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors,
    });
  }

  if (
    err instanceof MongoServerError &&
    err.code === ERROR_CODES.MONGO_DUPLICATE_KEY
  ) {
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
    "status" in err &&
    err.status === HTTP_STATUS.BAD_REQUEST &&
    "body" in err
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: USERS_MESSAGES.INVALID_JSON_SYNTAX,
    });
  }

  console.error("❌ INTERNAL SERVER ERROR:", err);

  const response: {
    message: string;
    errors?: string;
    stack?: string;
  } = {
    message: USERS_MESSAGES.INTERNAL_SERVER_ERROR,
  };

  if (!isProduction) {
    response.errors = err instanceof Error ? err.message : String(err);
    response.stack = err instanceof Error ? err.stack : "Stack not available";
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};
