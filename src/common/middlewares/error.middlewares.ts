/* eslint-disable @typescript-eslint/no-explicit-any */
import { isProduction } from "@/common/config/env.js";
import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import { MongoServerError } from "mongodb";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import {
  ConflictError,
  EntityError,
  ErrorWithStatus,
  UnauthorizedError,
} from "@/common/utils/errors.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ERROR_CODES } from "../constants/error-codes";

const handleMongooseValidationError = (err: mongoose.Error.ValidationError) => {
  const details: Record<string, any> = {};

  Object.keys(err.errors).forEach((key) => {
    const errorKind = err.errors[key];
    if (errorKind)
      details[key] = {
        code: ERROR_CODES.MONGOOSE.VALIDATION,
        message: errorKind.message,
        value: errorKind.value as string,
      };
  });

  return new EntityError({
    code: ERROR_CODES.VALIDATION.INVALID_PAYLOAD,
    details,
  });
};

const handleMongooseDuplicateKeyError = (err: MongoServerError) => {
  const match = /index: ([a-zA-Z0-9_]+)_1/.exec(err.message);
  const fieldName = match?.[1] ?? "unknown_field";

  return new ConflictError({
    code: ERROR_CODES.DB.DUPLICATE_KEY,
    details: { field: fieldName },
  });
};

const handleJwtError = (err: Error) => {
  if (err instanceof jwt.TokenExpiredError) {
    return new UnauthorizedError({
      code: ERROR_CODES.AUTH.TOKEN_EXPIRED,
      message: USERS_MESSAGES.TOKEN_EXPIRED,
    });
  }

  return new UnauthorizedError({
    code: ERROR_CODES.AUTH.INVALID_TOKEN,
    message: USERS_MESSAGES.TOKEN_INVALID_OR_MALFORMED,
  });
};

export const defaultErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: { code: ERROR_CODES.SYSTEM.INVALID_JSON_SYNTAX },
    });
  }

  // eslint-disable-next-line
  let finalError: ErrorWithStatus = err;

  if (err instanceof mongoose.Error.ValidationError) {
    finalError = handleMongooseValidationError(err);
  } else if (
    err instanceof MongoServerError &&
    err.code === ERROR_CODES.DB.MONGO_DUPLICATE_KEY
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
    return res.status(finalError.status).json({
      success: false,
      error: {
        code: finalError.code,
        ...(finalError.details && { details: finalError.details }),
      },
    });
  }

  console.error("❌ INTERNAL SERVER ERROR:", err);

  const errorResponse: Record<string, any> = {
    code: ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
  };

  if (!isProduction) {
    errorResponse.details = err instanceof Error ? err.message : String(err);
    errorResponse.stack =
      err instanceof Error ? err.stack : "Stack not available";
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: errorResponse,
  });
};
