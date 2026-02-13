/* eslint-disable @typescript-eslint/no-explicit-any */
import { isProduction } from "@/common/config/env.js";
import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import { MongoServerError } from "mongodb";
import { ERROR_CODES, USERS_MESSAGES } from "@/common/constants/messages.js";
import {
  ConflictError,
  EntityError,
  ErrorWithStatus,
  UnauthorizedError,
} from "@/common/utils/errors.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const omit = <T extends Record<string, any>>(
  obj: T,
  keys: string[],
): Partial<T> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

const handleMongooseValidationError = (err: mongoose.Error.ValidationError) => {
  const errors: Record<string, any> = {};

  Object.keys(err.errors).forEach((key) => {
    const errorKind = err.errors[key];
    if (errorKind)
      errors[key] = {
        msg: errorKind.message,
        value: errorKind.value as string,
      };
  });

  return new EntityError({
    message: USERS_MESSAGES.VALIDATION_DATA_ERROR,
    errors,
  });
};

const handleMongooseDuplicateKeyError = (err: MongoServerError) => {
  const match = /index: ([a-zA-Z0-9_]+)_1/.exec(err.message);
  const fieldName = match?.[1] ?? "Dữ liệu";

  const msg = USERS_MESSAGES.FIELD_ALREADY_EXISTS(fieldName);

  return new ConflictError(msg);
};

const handleJwtError = (err: Error) => {
  const message =
    err instanceof jwt.TokenExpiredError
      ? "Token đã hết hạn"
      : USERS_MESSAGES.TOKEN_EXPIRED_OR_INVALID;

  return new UnauthorizedError(message);
};

export const defaultErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: USERS_MESSAGES.INVALID_JSON_SYNTAX,
    });
  }

  // eslint-disable-next-line
  let finalError: ErrorWithStatus | any = err;

  if (err instanceof mongoose.Error.ValidationError) {
    finalError = handleMongooseValidationError(err);
  } else if (
    err instanceof MongoServerError &&
    err.code === ERROR_CODES.MONGO_DUPLICATE_KEY
  ) {
    finalError = handleMongooseDuplicateKeyError(err);
  } else if (
    err instanceof jwt.JsonWebTokenError ||
    err instanceof jwt.TokenExpiredError ||
    err instanceof jwt.NotBeforeError
  ) {
    finalError = handleJwtError(err);
  }

  if (finalError instanceof ErrorWithStatus) {
    return res.status(finalError.status).json(omit(finalError, ["status"]));
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
