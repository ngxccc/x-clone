import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import type {
  ChangePasswordBodyType,
  FollowBodyType,
  GetFollowersParamsType,
  PaginationQueryType,
  UnfollowParamsType,
  UpdateMeBodyType,
} from "./users.schemas.js";
import usersService from "./users.services.js";
import type { NextFunction, Request, Response } from "express";

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.decodedAccessToken!;

    const result = await usersService.getMe(userId);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.GET_ME_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.params;
    const myUserId = req.decodedAccessToken?.userId;

    const result = await usersService.getProfile(username!, myUserId);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.decodedAccessToken!;
    const payload = req.body as UpdateMeBodyType;

    const result = await usersService.updateMe(userId, payload);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const followController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.decodedAccessToken!;
    const { followedUserId } = req.body as FollowBodyType;

    const result = await usersService.follow(userId, followedUserId);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.FOLLOW_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.decodedAccessToken!;
    const { followedUserId } = req.params as UnfollowParamsType;

    const result = await usersService.unfollow(userId, followedUserId);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.UNFOLLOW_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params as GetFollowersParamsType;
    const { limit, page } = req.validatedQuery as PaginationQueryType;

    const result = await usersService.getFollowers(userId, limit, page);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.GET_FOLLOWERS_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params as GetFollowersParamsType;
    const { limit, page } = req.validatedQuery as PaginationQueryType;

    const result = await usersService.getFollowing(userId, limit, page);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.GET_FOLLOWING_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request<object, object, ChangePasswordBodyType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.decodedAccessToken!;
    const payload = req.body;

    const result = await usersService.changePassword(userId, payload);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};
