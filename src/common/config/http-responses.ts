import {
  ValidationErrorRes,
  ErrorRes,
  ForbiddenErrorRes,
  UnauthorizedErrorRes,
} from "@/common/schemas/common.schemas";
import type { ResponseConfig } from "@asteasolutions/zod-to-openapi";

export const COMMON_ERRORS: Record<number, ResponseConfig> = {
  400: {
    description: "Bad Request - Invalid syntax or missing required headers",
    content: { "application/json": { schema: ErrorRes } },
  },
  401: {
    description: "Unauthorized - Missing or invalid Bearer token",
    content: { "application/json": { schema: UnauthorizedErrorRes } },
  },
  403: {
    description: "Forbidden - Insufficient permissions to access this resource",
    content: { "application/json": { schema: ForbiddenErrorRes } },
  },
  404: {
    description: "Not Found - The requested resource does not exist",
    content: { "application/json": { schema: ErrorRes } },
  },
  409: {
    description: "Conflict - Business logic conflict (e.g., Duplicate record)",
    content: { "application/json": { schema: ErrorRes } },
  },
  422: {
    description: "Unprocessable Entity - Payload failed Zod validation",
    content: { "application/json": { schema: ValidationErrorRes } },
  },
  429: {
    description: "Too Many Requests - Rate limit exceeded",
    content: { "application/json": { schema: ErrorRes } },
  },
  500: {
    description: "Internal Server Error - Unexpected system crash",
    content: { "application/json": { schema: ErrorRes } },
  },
};
