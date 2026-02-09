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
import type { NextFunction, Request, Response } from "express";
import type { UserService } from "./users.services.js";

export class UserController {
  public constructor(private readonly userService: UserService) {}

  public getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decodedAccessToken!;

      const result = await this.userService.getMe(userId);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.GET_ME_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username } = req.params;
      const myUserId = req.decodedAccessToken?.userId;

      const result = await this.userService.getProfile(username!, myUserId);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decodedAccessToken!;
      const payload = req.body as UpdateMeBodyType;

      const result = await this.userService.updateMe(userId, payload);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  public follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decodedAccessToken!;
      const { followedUserId } = req.body as FollowBodyType;

      const result = await this.userService.follow(userId, followedUserId);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.FOLLOW_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  public unfollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decodedAccessToken!;
      const { followedUserId } = req.params as UnfollowParamsType;

      const result = await this.userService.unfollow(userId, followedUserId);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.UNFOLLOW_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getFollowers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params as GetFollowersParamsType;
      const { limit, page } = req.validatedQuery as PaginationQueryType;

      const result = await this.userService.getFollowers(userId, limit, page);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.GET_FOLLOWERS_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params as GetFollowersParamsType;
      const { limit, page } = req.validatedQuery as PaginationQueryType;

      const result = await this.userService.getFollowing(userId, limit, page);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.GET_FOLLOWING_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (
    req: Request<object, object, ChangePasswordBodyType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.decodedAccessToken!;
      const payload = req.body;

      const result = await this.userService.changePassword(userId, payload);

      return res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS,
        result,
      });
    } catch (error) {
      next(error);
    }
  };
}
