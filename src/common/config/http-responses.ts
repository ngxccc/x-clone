import {
  ValidationErrorRes,
  ErrorRes,
  ForbiddenErrorRes,
  UnauthorizedErrorRes,
} from "@/common/schemas/common.schemas";
import type { ResponseConfig } from "@asteasolutions/zod-to-openapi";

export const COMMON_ERRORS: Record<number, ResponseConfig> = {
  400: {
    description: "Bad Request (Dữ liệu gửi lên không hợp lệ về mặt logic)",
    content: { "application/json": { schema: ErrorRes } },
  },
  401: {
    description: "Unauthorized (Chưa đăng nhập hoặc Token hết hạn)",
    content: { "application/json": { schema: UnauthorizedErrorRes } },
  },
  403: {
    description: "Forbidden (Không có quyền truy cập tài nguyên này)",
    content: { "application/json": { schema: ForbiddenErrorRes } },
  },
  404: {
    description: "Not Found (Không tìm thấy tài nguyên)",
    content: { "application/json": { schema: ErrorRes } },
  },
  422: {
    description: "Validation Error (Dữ liệu không đúng định dạng Zod)",
    content: { "application/json": { schema: ValidationErrorRes } },
  },
  500: {
    description: "Internal Server Error (Lỗi hệ thống)",
    content: { "application/json": { schema: ErrorRes } },
  },
};
