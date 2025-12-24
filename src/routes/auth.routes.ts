import {
  loginController,
  registerController,
} from "@/controllers/auth.controllers.js";
import { loginValidator } from "@/middlewares/auth.middlewares.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { RegisterBody } from "@/requests/auth.requests.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", loginValidator, loginController);
authRouter.post("/register", validate(RegisterBody), registerController);

export default authRouter;
