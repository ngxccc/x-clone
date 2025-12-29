import { getMeController } from "@/controllers/users.controllers.js";
import { accessTokenValidator } from "@/middlewares/auth.middlewares.js";
import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/me", accessTokenValidator, getMeController);

export default usersRouter;
