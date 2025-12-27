import {
  loginController,
  logoutController,
  registerController,
  verifyEmailController,
} from "@/controllers/auth.controllers.js";
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  refreshTokenValidator,
} from "@/middlewares/auth.middlewares.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
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

export default authRouter;
