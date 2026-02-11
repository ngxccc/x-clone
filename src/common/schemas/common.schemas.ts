import { z } from "zod";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

/**
 * @name EmailSchema
 * @usage Login, Register, ForgotPass...
 */
export const emailSchema = z
  .email(USERS_MESSAGES.EMAIL_INVALID_FORMAT)
  .openapi({
    example: "user@example.com",
    description: "Email người dùng",
  });

/**
 * @name BasePassword (Yếu - Chỉ check độ dài)
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
 * @name StrongPassword (Mạnh - Kế thừa Base + Thêm Regex)
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
 * @name Confirm Password Schema
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
 * @name JWT Token Schema
 * @usage verify email, forgot pass...
 * @example
 * tokenSchema("Token is required")
 */
export const tokenSchema = (msg: string) =>
  z.string(msg).trim().min(1, msg).openapi({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT Token (Verify Email / Forgot Password)",
  });
