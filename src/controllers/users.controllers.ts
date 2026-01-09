import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import {
  FollowBodyType,
  GetFollowersParamsType,
  PaginationQueryType,
  UnfollowParamsType,
  UpdateMeBodyType,
} from "@/schemas/users.schemas.js";
import usersService from "@/services/users.services.js";
import { NextFunction, Request, Response } from "express";

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

    const result = await usersService.getProfile(username as string, myUserId);

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
    // Double Casting
    const { limit, page } = req.query as unknown as PaginationQueryType;

    const result = await usersService.getFollowers(userId, limit, page);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.GET_FOLLOWERS_SUCCESS,
      result,
    });
  } catch (error) {
    next(error);
  }
};
