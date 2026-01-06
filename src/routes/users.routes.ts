import {
  getMeController,
  getProfileController,
  updateMeController,
} from "@/controllers/users.controllers.js";
import {
  accessTokenValidator,
  isUserLoggedInValidator,
} from "@/middlewares/auth.middlewares.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { UpdateMeReqBody } from "@/schemas/users.schemas.js";
import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/me", accessTokenValidator, getMeController);
usersRouter.patch(
  "/me",
  accessTokenValidator,
  validate(UpdateMeReqBody),
  updateMeController,
);

// Đặt dynamic route sau static route tránh bị trùng
usersRouter.get("/:username", isUserLoggedInValidator, getProfileController);

export default usersRouter;
