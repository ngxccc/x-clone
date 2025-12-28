import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendVerificationEmailController,
  resetPasswordController,
  verifyEmailController,
} from "@/controllers/auth.controllers.js";
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  refreshTokenValidator,
} from "@/middlewares/auth.middlewares.js";
import { resendEmailLimiter } from "@/middlewares/rateLimit.middlewares.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
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
  resetPasswordController,
);

export default authRouter;
