import { USERS_MESSAGES } from "@/constants/messages.js";
import { requiredString } from "@/utils/validation.js";
import { z } from "zod";

export const RegisterReqBody = z
  .object({
    name: z
      .string(USERS_MESSAGES.NAME_IS_REQUIRED)
      .trim()
      .min(1, USERS_MESSAGES.NAME_MIN_LENGTH)
      .max(100, USERS_MESSAGES.NAME_MAX_LENGTH),
    username: z
      .string(USERS_MESSAGES.USERNAME_IS_REQUIRED)
      .trim()
      .min(3, USERS_MESSAGES.USERNAME_MIN_LENGTH)
      .max(255, USERS_MESSAGES.USERNAME_MAX_LENGTH)
      // Regex: Chỉ cho phép chữ, số, _ và .
      .regex(/^[a-zA-Z0-9._]+$/, USERS_MESSAGES.USERNAME_IS_INVALID),
    email: z.email(USERS_MESSAGES.EMAIL_INVALID_FORMAT),
    password: z
      .string(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
      .min(6, USERS_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/,
        USERS_MESSAGES.PASSWORD_NOT_STRONG,
      ),
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
  password: requiredString(USERS_MESSAGES.PASSWORD_IS_REQUIRED),
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
      .min(6, USERS_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/,
        USERS_MESSAGES.PASSWORD_NOT_STRONG,
      ),
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

export const LoginGoogleReqBody = z.object({
  code: requiredString(USERS_MESSAGES.GOOGLE_CODE_IS_REQUIRED),
});

export type LoginGoogleBodyType = z.infer<typeof LoginGoogleReqBody>;
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenReqBody>;
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordReqBody>;
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordReqBody>;
export type ResendVerificationEmailBodyType = z.infer<
  typeof ResendVerificationEmailReqBody
>;
export type VerifyEmailBodyType = z.infer<typeof VerifyEmailReqBody>;
export type LogoutBodyType = z.infer<typeof LogoutReqBody>;
export type LoginBodyType = z.infer<typeof LoginReqBody>;
export type RegisterBodyType = z.infer<typeof RegisterReqBody>;
