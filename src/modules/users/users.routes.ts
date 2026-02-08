import {
  validate,
  validateParams,
  validateQuery,
} from "@/common/middlewares/validate.middleware.js";
import {
  ChangePasswordReqBody,
  FollowReqBody,
  GetFollowersReqParams,
  PaginationReqQuery,
  UnfollowReqParams,
  UpdateMeReqBody,
} from "./users.schemas.js";
import { Router } from "express";
import type { UserController } from "./users.controllers.js";
import type { AuthMiddleware } from "../auth/auth.middlewares.js";

export const createUsersRouter = (
  userController: UserController,
  authMiddleware: AuthMiddleware,
) => {
  const router = Router();

  router.get("/me", authMiddleware.accessTokenValidator, userController.getMe);

  router.patch(
    "/me",
    authMiddleware.accessTokenValidator,
    validate(UpdateMeReqBody),
    userController.updateMe,
  );

  router.post(
    "/follow",
    authMiddleware.accessTokenValidator,
    validate(FollowReqBody),
    userController.follow,
  );

  router.put(
    "/change-password",
    authMiddleware.accessTokenValidator,
    validate(ChangePasswordReqBody),
    userController.changePassword,
  );

  // Đặt dynamic route sau static route tránh bị trùng
  router.get(
    "/:username",
    authMiddleware.isUserLoggedInValidator,
    userController.getProfile,
  );

  router.delete(
    "/follow/:followedUserId",
    authMiddleware.accessTokenValidator,
    validateParams(UnfollowReqParams),
    userController.unfollow,
  );

  router.get(
    "/:userId/followers",
    authMiddleware.isUserLoggedInValidator,
    validateParams(GetFollowersReqParams),
    validateQuery(PaginationReqQuery),
    userController.getFollowers,
  );

  router.get(
    "/:userId/following",
    authMiddleware.isUserLoggedInValidator,
    validateParams(GetFollowersReqParams),
    validateQuery(PaginationReqQuery),
    userController.getFollowing,
  );

  return router;
};
