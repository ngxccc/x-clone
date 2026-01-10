import {
  forgotPasswordController,
  loginController,
  logoutController,
  loginGoogleController,
  refreshTokenController,
  registerController,
  resendVerificationEmailController,
  resetPasswordController,
  verifyEmailController,
} from "@/controllers/auth.controllers.js";
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordTokenValidator,
  refreshTokenValidator,
} from "@/middlewares/auth.middlewares.js";
import {
  refreshTokenLimiter,
  resendEmailLimiter,
} from "@/middlewares/rateLimit.middlewares.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  LoginGoogleReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResendVerificationEmailReqBody,
  ResetPasswordReqBody,
  VerifyEmailReqBody,
} from "@/schemas/auth.schemas.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", validate(LoginReqBody), loginController);

authRouter.post("/register", validate(RegisterReqBody), registerController);

authRouter.post(
  "/logout",
  validate(LogoutReqBody),
  accessTokenValidator,
  refreshTokenValidator,
  logoutController,
);

authRouter.post(
  "/verify-email",
  validate(VerifyEmailReqBody),
  emailVerifyTokenValidator,
  verifyEmailController,
);

authRouter.post(
  "/resend-verification-email",
  resendEmailLimiter,
  validate(ResendVerificationEmailReqBody),
  resendVerificationEmailController,
);

authRouter.post(
  "/forgot-password",
  resendEmailLimiter,
  validate(ForgotPasswordReqBody),
  forgotPasswordController,
);

authRouter.post(
  "/reset-password",
  validate(ResetPasswordReqBody),
  forgotPasswordTokenValidator,
  resetPasswordController,
);

authRouter.post(
  "/refresh-token",
  refreshTokenLimiter,
  validate(RefreshTokenReqBody),
  refreshTokenValidator,
  refreshTokenController,
);

authRouter.post(
  "/login/google",
  validate(LoginGoogleReqBody),
  loginGoogleController,
);

export default authRouter;
