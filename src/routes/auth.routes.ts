import {
  loginController,
  logoutController,
  registerController,
  resendVerificationEmailController,
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
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResendVerificationEmailReqBody,
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

export default authRouter;
