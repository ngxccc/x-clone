/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import { ERROR_CODES } from "../constants/error-codes";

export interface ErrorOptions<T = Record<string, unknown>> {
  code: string;
  message?: string; // Server log
  details?: T;
}

export class ErrorWithStatus<T = Record<string, unknown>> extends Error {
  public status: number;
  public code: string;
  public details?: T;

  public constructor(
    status: number,
    { code, message, details }: ErrorOptions<T>,
  ) {
    super(message ?? code);
    this.status = status;
    this.code = code;
    this.details = details;

    // Chỉ ra lỗi xuất phát từ file nào, dòng số mấy
    // Và loại bỏ constructor ra khỏi stack trace.
    // check if this func is exist in curr runtime
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class EntityError extends ErrorWithStatus<Record<string, any>> {
  public constructor({
    code,
    message,
    details,
  }: ErrorOptions<Record<string, any>>) {
    super(HTTP_STATUS.UNPROCESSABLE_ENTITY, {
      code: code || ERROR_CODES.VALIDATION.FAILED,
      message: message ?? "Data validation failed",
      details,
    });
  }
}

export class BadRequestError extends ErrorWithStatus {
  public constructor(options: ErrorOptions) {
    super(HTTP_STATUS.BAD_REQUEST, options);
  }
}

export class UnauthorizedError extends ErrorWithStatus {
  public constructor(options: ErrorOptions) {
    super(HTTP_STATUS.UNAUTHORIZED, options);
  }
}

export class ForbiddenError extends ErrorWithStatus {
  public constructor(options: ErrorOptions) {
    super(HTTP_STATUS.FORBIDDEN, options);
  }
}

export class NotFoundError extends ErrorWithStatus {
  public constructor(options: ErrorOptions) {
    super(HTTP_STATUS.NOT_FOUND, options);
  }
}

export class ConflictError extends ErrorWithStatus {
  public constructor(options: ErrorOptions) {
    super(HTTP_STATUS.CONFLICT, options);
  }
}

export class UnprocessableEntityError extends ErrorWithStatus {
  public constructor(options: ErrorOptions) {
    super(HTTP_STATUS.UNPROCESSABLE_ENTITY, options);
  }
}

export class PayloadTooLargeError extends ErrorWithStatus {
  public constructor(options: ErrorOptions) {
    super(HTTP_STATUS.PAYLOAD_TOO_LARGE, options);
  }
}

export class InternalServerError extends ErrorWithStatus {
  public constructor(options: ErrorOptions) {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, options);
  }
}
