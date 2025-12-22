import { loginController } from "@/controllers/users.controllers.js";
import { loginValidator } from "@/middlewares/users.middlewares.js";
import { Router } from "express";

const usersRouter = Router();

usersRouter.post("/login", loginValidator, loginController);

export default usersRouter;
