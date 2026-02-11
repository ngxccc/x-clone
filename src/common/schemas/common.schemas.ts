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
 * @param dataSchema Schema của phần 'result'
 * @param msg Default message
 */
export const BuildSuccessRes = (dataSchema: z.ZodType, msg = "Thành công") =>
  z.object({
    message: z.string().openapi({ example: msg }),
    result: dataSchema,
  });

/**
 * Generic Error Response (400, 401, 403, 404...)
 */
// TODO: Tách ra cấu hình err cho từng res
export const ErrorRes = z
  .object({
    message: z.string().openapi({ example: "Lỗi gì đó..." }),
    errors: z
      .record(z.string(), z.any())
      .optional()
      .openapi({
        description: "Chi tiết lỗi validation (nếu có)",
        example: { email: { msg: "Invalid email" } },
      }),
  })
  .openapi("ErrorResponse");

export const UnauthorizedErrorRes = z.object({
  message: z.string().openapi({ example: "Email hoặc mật khẩu không đúng" }),
  errorCode: z.string().optional().openapi({ example: "PASSWORD_INCORRECT" }),
});

export const ForbiddenErrorRes = z.object({
  message: z.string().openapi({ example: "Email chưa được xác thực" }),
  errorCode: z.string().optional().openapi({ example: "EMAIL_NOT_VERIFIED" }),
});

/**
 * 422 Validation Error Schema
 */
export const ValidationErrorRes = z
  .object({
    message: z.string().openapi({ example: "Lỗi validation dữ liệu" }),
    errors: z
      .record(
        z.string(), // Key là tên field (vd: email, password)
        z.array(z.string()),
      )
      .openapi({
        description: "Chi tiết lỗi validation theo từng trường",
        example: {
          email: ["Email không đúng định dạng"],
          password: ["Mật khẩu phải có chữ hoa"],
        },
      }),
  })
  .openapi("EntityErrorResponse");
