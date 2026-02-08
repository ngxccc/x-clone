import {
  refreshTokenLimiter,
  resendEmailLimiter,
} from "@/common/middlewares/rateLimit.middlewares.js";
import {
  validate,
  validateCookies,
} from "@/common/middlewares/validate.middleware.js";
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LoginGoogleReqBody,
  RegisterReqBody,
  ResendVerificationEmailReqBody,
  ResetPasswordReqBody,
  VerifyEmailReqBody,
  RefreshTokenReqCookie,
} from "./auth.schemas.js";
import { Router } from "express";
import type { AuthController } from "./auth.controllers.js";
import type { AuthMiddleware } from "./auth.middlewares.js";

export const createAuthRouter = (
  authController: AuthController,
  authMiddleware: AuthMiddleware,
) => {
  const router = Router();

  router.post("/login", validate(LoginReqBody), authController.login);

  router.post("/register", validate(RegisterReqBody), authController.register);

  router.post(
    "/logout",
    validateCookies(RefreshTokenReqCookie),
    authMiddleware.refreshTokenValidator,
    authController.logout,
  );

  router.post(
    "/verify-email",
    validate(VerifyEmailReqBody),
    authMiddleware.emailVerifyTokenValidator,
    authController.verifyEmail,
  );

  router.post(
    "/resend-verification-email",
    resendEmailLimiter,
    validate(ResendVerificationEmailReqBody),
    authController.resendVerificationEmail,
  );

  router.post(
    "/forgot-password",
    resendEmailLimiter,
    validate(ForgotPasswordReqBody),
    authController.forgotPassword,
  );

  router.post(
    "/reset-password",
    validate(ResetPasswordReqBody),
    authMiddleware.forgotPasswordTokenValidator,
    authController.resetPassword,
  );

  router.post(
    "/refresh-token",
    refreshTokenLimiter,
    validateCookies(RefreshTokenReqCookie),
    authMiddleware.refreshTokenValidator,
    authController.refreshToken,
  );

  router.post(
    "/login/google",
    validate(LoginGoogleReqBody),
    authController.loginGoogle,
  );

  return router;
};
