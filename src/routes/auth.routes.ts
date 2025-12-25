import {
  loginController,
  registerController,
} from "@/controllers/auth.controllers.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { LoginReqBody, RegisterReqBody } from "@/schemas/auth.schemas.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", validate(LoginReqBody), loginController);
authRouter.post("/register", validate(RegisterReqBody), registerController);

export default authRouter;
