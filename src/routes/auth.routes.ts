import {
  loginController,
  logoutController,
  registerController,
} from "@/controllers/auth.controllers.js";
import {
  accessTokenValidator,
  refreshTokenValidator,
} from "@/middlewares/auth.middlewares.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
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

export default authRouter;
