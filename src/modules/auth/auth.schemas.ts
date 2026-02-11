import { USERS_MESSAGES } from "@/common/constants/messages.js";
import {
  basePasswordSchema,
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
  tokenSchema,
} from "@/common/schemas/common.schemas";
import { z } from "zod";

export const RegisterReqBody = z
  .object({
    name: z
      .string(USERS_MESSAGES.NAME_IS_REQUIRED)
      .trim()
      .min(1, USERS_MESSAGES.NAME_MIN_LENGTH)
      .max(100, USERS_MESSAGES.NAME_MAX_LENGTH)
      .openapi({
        example: "Nguyễn Văn A",
        description: "Tên hiển thị người dùng",
      }),
    username: z
      .string(USERS_MESSAGES.USERNAME_IS_REQUIRED)
      .trim()
      .min(3, USERS_MESSAGES.USERNAME_MIN_LENGTH)
      .max(255, USERS_MESSAGES.USERNAME_MAX_LENGTH)
      .regex(/^[a-zA-Z0-9._]+$/, USERS_MESSAGES.USERNAME_IS_INVALID)
      .openapi({
        example: "shin_coder.99",
        description: "Username chỉ chứa chữ, số, dấu gạch dưới và dấu chấm",
      }),
    email: emailSchema.openapi({
      description: "Email đăng ký tài khoản (Dùng để xác thực)",
    }),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    dateOfBirth: z.coerce
      .date({
        error: (issue) =>
          issue.code === "invalid_type"
            ? USERS_MESSAGES.DATE_OF_BIRTH_INVALID
            : USERS_MESSAGES.UNKNOWN_ERROR,
      })
      .openapi({
        example: "2005-01-01T00:00:00.000Z",
        description: "Ngày sinh theo chuẩn ISO 8601",
        type: "string",
        format: "date",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ["confirmPassword"],
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .transform(({ confirmPassword, ...rest }) => rest)
  .openapi("RegisterRequest");

export const RegisterData = z
  .object({
    _id: z.string().openapi({ example: "698c0460284cfeb2d9b6b156" }),
    username: z.string().openapi({ example: "shin_coder.99" }),
    email: z.string().openapi({ example: "user@example.com" }),
    dateOfBirth: z.date().openapi({ example: "2005-01-01T00:00:00.000Z" }),
  })
  .openapi("RegisterResultData");

export const LoginReqBody = z
  .object({
    email: emailSchema.openapi({
      description: "Email đăng nhập",
    }),
    password: basePasswordSchema.openapi({
      description: "Mật khẩu người dùng",
    }),
  })
  .openapi("LoginRequest");

export const LoginData = z
  .object({
    accessToken: z
      .string()
      .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
  })
  .openapi("LoginResultData");

export const VerifyEmailReqBody = z
  .object({
    emailVerifyToken: tokenSchema(
      USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
    ).openapi({
      description: "JWT Token gửi qua email để xác thực tài khoản",
    }),
  })
  .openapi("VerifyEmailRequest");

export const ResendVerificationEmailReqBody = z
  .object({
    email: emailSchema.openapi({
      description: "Email cần gửi lại mã xác thực",
    }),
  })
  .openapi("ResendVerificationRequest");

export const ForgotPasswordReqBody = z
  .object({
    email: emailSchema.openapi({
      description: "Email của tài khoản bị quên mật khẩu",
    }),
  })
  .openapi("ForgotPasswordRequest");

export const ResetPasswordReqBody = z
  .object({
    forgotPasswordToken: tokenSchema(
      USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
    ).openapi({
      description: "Token verify quên mật khẩu (Lấy từ email)",
    }),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ["confirmPassword"],
  })
  .openapi("ResetPasswordRequest");

export const LoginGoogleReqBody = z
  .object({
    code: tokenSchema(USERS_MESSAGES.GOOGLE_CODE_IS_REQUIRED).openapi({
      example: "4/0AeaYSH...",
      description: "Authorization Code nhận được từ Google OAuth2",
    }),
  })
  .openapi("LoginGoogleRequest");

export const RefreshTokenReqCookie = z
  .object({
    refresh_token: tokenSchema(
      USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
    ).openapi({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      description: "Refresh Token lưu trong HttpOnly Cookie",
    }),
  })
  .openapi("RefreshTokenCookie");

export type RefreshTokenCookieType = z.infer<typeof RefreshTokenReqCookie>;
export type LoginGoogleBodyType = z.infer<typeof LoginGoogleReqBody>;
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordReqBody>;
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordReqBody>;
export type ResendVerificationEmailBodyType = z.infer<
  typeof ResendVerificationEmailReqBody
>;
export type VerifyEmailBodyType = z.infer<typeof VerifyEmailReqBody>;
export type LoginBodyType = z.infer<typeof LoginReqBody>;
export type RegisterBodyType = z.infer<typeof RegisterReqBody>;
