import { HTTP_STATUS } from "@/constants/httpStatus.js";

export class ErrorWithStatus extends Error {
  status: number;
  errorCode?: string;

  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.name = this.constructor.name; // Set name: "ErrorWithStatus"
    // Chỉ ra lỗi xuất phát từ file nào, dòng số mấy
    // Và loại bỏ constructor ra khỏi stack trace.
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ErrorWithStatus {
  constructor(message: string, errorCode?: string) {
    super(message, HTTP_STATUS.BAD_REQUEST, errorCode);
  }
}

export class UnauthorizedError extends ErrorWithStatus {
  constructor(message: string, errorCode?: string) {
    super(message, HTTP_STATUS.UNAUTHORIZED, errorCode);
  }
}

export class ForbiddenError extends ErrorWithStatus {
  constructor(message: string, errorCode?: string) {
    super(message, HTTP_STATUS.FORBIDDEN, errorCode);
  }
}

export class NotFoundError extends ErrorWithStatus {
  constructor(message: string, errorCode?: string) {
    super(message, HTTP_STATUS.NOT_FOUND, errorCode);
  }
}

export class ConflictError extends ErrorWithStatus {
  constructor(message: string, errorCode?: string) {
    super(message, HTTP_STATUS.CONFLICT, errorCode);
  }
}
