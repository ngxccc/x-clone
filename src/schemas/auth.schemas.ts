import { USERS_MESSAGES } from "@/constants/messages.js";
import { requiredString } from "@/utils/validation.js";
import { z } from "zod";

export const RegisterReqBody = z
  .object({
    username: z
      .string(USERS_MESSAGES.USERNAME_IS_REQUIRED)
      .trim()
      .min(3, USERS_MESSAGES.USERNAME_MIN_LENGTH)
      .max(255, USERS_MESSAGES.USERNAME_MAX_LENGTH)
      // Regex: Chỉ cho phép chữ, số, _ và .
      .regex(/^[a-zA-Z0-9._]+$/, USERS_MESSAGES.USERNAME_INVALID),
    email: z.email(USERS_MESSAGES.EMAIL_INVALID_FORMAT),
    password: z
      .string(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
      .min(6, USERS_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: requiredString(
      USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
    ),
    // z.coerce tự động ép kiểu String -> Date
    dateOfBirth: z.coerce.date({
      error: (issue) =>
        issue.code === "invalid_type"
          ? USERS_MESSAGES.DATE_OF_BIRTH_INVALID
          : USERS_MESSAGES.UNKNOWN_ERROR,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ["confirmPassword"], // Đánh dấu lỗi sẽ hiện ở trường confirmPassword
  });

export const LoginReqBody = z.object({
  email: z.email(USERS_MESSAGES.EMAIL_INVALID_FORMAT),
  password: requiredString(USERS_MESSAGES.PASSWORD_MUST_NOT_BE_EMPTY),
});

export const LogoutReqBody = z.object({
  refreshToken: requiredString(USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED),
});

export const VerifyEmailReqBody = z.object({
  emailVerifyToken: requiredString(
    USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
  ),
});

export const ResendVerificationEmailReqBody = z.object({
  email: z.email(USERS_MESSAGES.EMAIL_INVALID_FORMAT),
});

export const ForgotPasswordReqBody = z.object({
  email: z.email(USERS_MESSAGES.EMAIL_INVALID_FORMAT),
});

export const ResetPasswordReqBody = z
  .object({
    forgotPasswordToken: requiredString(
      USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
    ),
    password: z
      .string(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
      .min(6, USERS_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: requiredString(
      USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ["confirmPassword"],
  });

export const RefreshTokenReqBody = z.object({
  refreshToken: requiredString(USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED),
});

export type RefreshTokenReqType = z.infer<typeof RefreshTokenReqBody>;
export type ForgotPasswordReqType = z.infer<typeof ForgotPasswordReqBody>;
export type ResetPasswordReqType = z.infer<typeof ResetPasswordReqBody>;
export type ResendVerificationEmailReqType = z.infer<
  typeof ResendVerificationEmailReqBody
>;
export type VerifyEmailReqType = z.infer<typeof VerifyEmailReqBody>;
export type LogoutReqType = z.infer<typeof LogoutReqBody>;
export type LoginReqType = z.infer<typeof LoginReqBody>;
export type RegisterReqType = z.infer<typeof RegisterReqBody>;
