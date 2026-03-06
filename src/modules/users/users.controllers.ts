import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
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

      const data = await this.userService.getMe(userId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
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

      const data = await this.userService.getProfile(username!, myUserId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decodedAccessToken!;
      const payload = req.body as UpdateMeBodyType;

      const data = await this.userService.updateMe(userId, payload);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decodedAccessToken!;
      const { followedUserId } = req.body as FollowBodyType;

      const data = await this.userService.follow(userId, followedUserId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public unfollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decodedAccessToken!;
      const { followedUserId } = req.params as UnfollowParamsType;

      const data = await this.userService.unfollow(userId, followedUserId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
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

      const data = await this.userService.getFollowers(userId, limit, page);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
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

      const data = await this.userService.getFollowing(userId, limit, page);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
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

      const data = await this.userService.changePassword(userId, payload);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
