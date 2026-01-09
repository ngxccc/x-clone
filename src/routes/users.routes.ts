import {
  followController,
  getFollowersController,
  getFollowingController,
  getMeController,
  getProfileController,
  unfollowController,
  updateMeController,
} from "@/controllers/users.controllers.js";
import {
  accessTokenValidator,
  isUserLoggedInValidator,
} from "@/middlewares/auth.middlewares.js";
import {
  validate,
  validateParams,
  validateQuery,
} from "@/middlewares/validate.middleware.js";
import {
  FollowReqBody,
  GetFollowersReqParams,
  PaginationReqQuery,
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
usersRouter.get("/:username", isUserLoggedInValidator, getProfileController);
usersRouter.delete(
  "/follow/:followedUserId",
  accessTokenValidator,
  validateParams(UnfollowReqParams),
  unfollowController,
);
usersRouter.get(
  "/:userId/followers",
  isUserLoggedInValidator,
  validateParams(GetFollowersReqParams),
  validateQuery(PaginationReqQuery),
  getFollowersController,
);
usersRouter.get(
  "/:userId/following",
  isUserLoggedInValidator,
  validateParams(GetFollowersReqParams),
  validateQuery(PaginationReqQuery),
  getFollowingController,
);

export default usersRouter;
