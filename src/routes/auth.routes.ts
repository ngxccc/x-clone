import {
  loginController,
  registerController,
} from "@/controllers/auth.controllers.js";
import { loginValidator } from "@/middlewares/auth.middlewares.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { RegisterReqBody } from "@/schemas/auth.schemas.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", loginValidator, loginController);
authRouter.post("/register", validate(RegisterReqBody), registerController);

export default authRouter;
