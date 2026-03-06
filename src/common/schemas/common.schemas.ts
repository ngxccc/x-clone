import { z } from "zod";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

/**
 * Email Schema
 * @usage Login, Register, ForgotPass...
 */
export const emailSchema = z
  .email(USERS_MESSAGES.EMAIL_INVALID_FORMAT)
  .openapi({
    example: "user@example.com",
    description: "Email người dùng",
  });

/**
 * BasePassword (Yếu - Chỉ check độ dài)
 * @usage Login (Hỗ trợ user cũ pass yếu)
 */
export const basePasswordSchema = z
  .string(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
  .min(6, USERS_MESSAGES.PASSWORD_MIN_LENGTH)
  .openapi({
    example: "Password@123",
    description: "Mật khẩu (Tối thiểu 6 ký tự)",
    type: "string",
    format: "password",
  });

/**
 * StrongPassword (Mạnh - Kế thừa Base + Thêm Regex)
 * @usage Register, Reset Password, Change Password
 */
export const passwordSchema = basePasswordSchema
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/,
    USERS_MESSAGES.PASSWORD_NOT_STRONG,
  )
  .openapi({
    description:
      "Mật khẩu mạnh (Tối thiểu 6 ký tự, gồm: Hoa, thường, số, ký tự đặc biệt)",
  });

/**
 * Confirm Password Schema
 */
export const confirmPasswordSchema = z
  .string(USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
  .openapi({
    example: "Password@123",
    description: "Nhập lại mật khẩu để xác nhận",
    type: "string",
    format: "password",
  });

/**
 * JWT Token Schema
 * @usage verify email, forgot pass...
 * @param msg Message
 * @example
 * tokenSchema("Token is required")
 */
export const tokenSchema = (msg: string) =>
  z.string(msg).trim().min(1, msg).openapi({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT Token (Verify Email / Forgot Password)",
  });

/**
 * Generic Success Response
 * @param dataSchema Schema của phần 'data'
 */
export const BuildSuccessRes = (dataSchema: z.ZodType) =>
  z.object({
    success: true,
    data: dataSchema,
  });

const ErrorDetailSchema = z.object({
  code: z.string().openapi({ description: "Mã lỗi chuẩn hóa từ server" }),
  details: z.record(z.string(), z.unknown()).optional().openapi({
    description: "Metadata hoặc chi tiết lỗi validation (nếu có)",
  }),
});

/**
 * Generic Error Response (Base Envelope Schema)
 */
export const ErrorRes = z
  .object({
    success: z.boolean().default(false).openapi({ example: false }),
    error: ErrorDetailSchema,
  })
  .openapi("ErrorResponse");

export const UnauthorizedErrorRes = ErrorRes.openapi({
  description: "Lỗi xác thực danh tính (Thiếu token, token hết hạn...)",
  example: {
    success: false,
    error: {
      code: "ERR_AUTH_MISSING_BEARER_TOKEN",
    },
  },
});

export const ForbiddenErrorRes = ErrorRes.openapi({
  description: "Lỗi phân quyền (Không đủ thẩm quyền truy cập)",
  example: {
    success: false,
    error: {
      code: "ERR_AUTH_FORBIDDEN_ACCESS",
    },
  },
});

/**
 * 422 Validation Error Schema
 */
export const ValidationErrorRes = z
  .object({
    success: z.boolean().default(false).openapi({ example: false }),
    error: z.object({
      code: z.string().openapi({ example: "ERR_VALIDATION_FAILED" }),
      // Định nghĩa gắt gao cấu trúc của details thay vì thả rông
      details: z
        .record(
          z.string(), // Key là tên field (vd: email, content)
          z.object({
            code: z.string().optional(),
            message: z.string(),
            value: z.unknown().optional(),
          }),
        )
        .openapi({
          description: "Danh sách lỗi chi tiết theo từng trường dữ liệu",
          example: {
            content: {
              code: "ERR_TWEET_TOO_LONG",
              message: "Content exceeds 280 characters",
              value: "A".repeat(300),
            },
            type: {
              code: "ERR_INVALID_ENUM",
              message: "Invalid tweet type",
            },
          },
        }),
    }),
  })
  .openapi("EntityErrorResponse");
