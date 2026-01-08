import {
  followController,
  getMeController,
  getProfileController,
  unfollowController,
  updateMeController,
} from "@/controllers/users.controllers.js";
import {
  accessTokenValidator,
  isUserLoggedInValidator,
} from "@/middlewares/auth.middlewares.js";
import { validate, validateParams } from "@/middlewares/validate.middleware.js";
import {
  FollowReqBody,
  UnfollowReqParams,
  UpdateMeReqBody,
} from "@/schemas/users.schemas.js";
import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/me", accessTokenValidator, getMeController);
usersRouter.patch(
  "/me",
  accessTokenValidator,
  validate(UpdateMeReqBody),
  updateMeController,
);
usersRouter.post(
  "/follow",
  accessTokenValidator,
  validate(FollowReqBody),
  followController,
);

// Đặt dynamic route sau static route tránh bị trùng
usersRouter.delete(
  "/follow/:followedUserId",
  accessTokenValidator,
  validateParams(UnfollowReqParams),
  unfollowController,
);
usersRouter.get("/:username", isUserLoggedInValidator, getProfileController);

export default usersRouter;
