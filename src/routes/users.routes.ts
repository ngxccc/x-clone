import {
  getMeController,
  getProfileController,
} from "@/controllers/users.controllers.js";
import {
  accessTokenValidator,
  isUserLoggedInValidator,
} from "@/middlewares/auth.middlewares.js";
import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/me", accessTokenValidator, getMeController);

// Đặt dynamic route sau static route tránh bị trùng
usersRouter.get("/:username", isUserLoggedInValidator, getProfileController);

export default usersRouter;
