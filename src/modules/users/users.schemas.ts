import { USERS_MESSAGES } from "@/common/constants/messages.js";
import {
  confirmPasswordSchema,
  passwordSchema,
} from "@/common/schemas/common.schemas";
import { requiredString } from "@/common/utils/validation.js";
import mongoose from "mongoose";
import { z } from "zod";

export const UpdateMeReqBody = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, USERS_MESSAGES.NAME_MIN_LENGTH)
      .max(100, USERS_MESSAGES.NAME_MAX_LENGTH)
      .optional()
      .openapi({ example: "Ngọc Shin", description: "Tên hiển thị mới" }),
    username: z
      .string()
      .trim()
      .min(3, USERS_MESSAGES.USERNAME_MIN_LENGTH)
      .max(255, USERS_MESSAGES.USERNAME_MAX_LENGTH)
      .regex(/^[a-zA-Z0-9._]+$/, USERS_MESSAGES.USERNAME_IS_INVALID)
      .optional()
      .openapi({ example: "shin_coder_updated", description: "Username mới" }),
    dateOfBirth: z.coerce
      .date({
        error: (issue) =>
          issue.code === "invalid_type"
            ? USERS_MESSAGES.DATE_OF_BIRTH_INVALID
            : USERS_MESSAGES.UNKNOWN_ERROR,
      })
      .optional()
      .openapi({
        example: "2005-01-01T00:00:00.000Z",
        type: "string",
        format: "date",
      }),
    bio: z
      .string()
      .trim()
      .max(160, USERS_MESSAGES.BIO_TOO_LONG)
      .optional()
      .openapi({ example: "Lập trình viên fullstack hệ 25/8" }),
    website: z
      .url(USERS_MESSAGES.WEBSITE_INVALID)
      .optional()
      .openapi({ example: "https://github.com/shin-tran" }),
    avatar: z
      .string()
      .max(400)
      .optional()
      .openapi({ example: "https://example.com/new-avatar.jpg" }),
  })
  .openapi("UpdateMeRequest");

export const FollowReqBody = z
  .object({
    followedUserId: z
      .string()
      .refine((val) => mongoose.isValidObjectId(val), {
        error: USERS_MESSAGES.USER_ID_INVALID,
      })
      .openapi({
        example: "698c0460284cfeb2d9b6b156",
        description: "ID của user muốn follow",
      }),
  })
  .openapi("FollowRequest");

export const UnfollowReqParams = z.object({
  followedUserId: z
    .string()
    .refine((val) => mongoose.isValidObjectId(val), {
      error: USERS_MESSAGES.USER_ID_INVALID,
    })
    .openapi({
      example: "698c0460284cfeb2d9b6b156",
      description: "ID của user muốn bỏ follow",
    }),
});

export const GetFollowersReqParams = z.object({
  userId: z
    .string()
    .refine((val) => mongoose.isValidObjectId(val), {
      error: USERS_MESSAGES.USER_ID_INVALID,
    })
    .openapi({
      example: "698c0460284cfeb2d9b6b156",
      description: "ID của user cần lấy danh sách",
    }),
});

export const PaginationReqQuery = z.object({
  limit: z.coerce
    .number()
    .min(1, USERS_MESSAGES.LIMIT_MIN_LENGTH)
    .max(100, USERS_MESSAGES.LIMIT_MAX_LENGTH)
    .default(10)
    .openapi({ example: 10, description: "Số lượng item trên 1 trang" }),
  cursor: z
    .string()
    .optional()
    .refine((val) => mongoose.isValidObjectId(val), {
      error: USERS_MESSAGES.USER_ID_INVALID,
    })
    .openapi({
      example: "698c0460284cfeb2d9b6b156",
      description: "ID của user panigation trước đó",
    }),
});

export const ChangePasswordReqBody = z
  .object({
    oldPassword: requiredString(USERS_MESSAGES.PASSWORD_IS_REQUIRED).openapi({
      example: "OldPassword@123",
      format: "password",
    }),
    password: passwordSchema.openapi({ description: "Mật khẩu mới" }),
    confirmPassword: confirmPasswordSchema.openapi({
      description: "Nhập lại mật khẩu mới",
    }),
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: USERS_MESSAGES.CHANGE_PASSWORD_SAME_AS_OLD,
    path: ["password"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ["confirmPassword"],
  })
  .openapi("ChangePasswordRequest");

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordReqBody>;
export type GetFollowersParamsType = z.infer<typeof GetFollowersReqParams>;
export type PaginationQueryType = z.infer<typeof PaginationReqQuery>;
export type UnfollowParamsType = z.infer<typeof UnfollowReqParams>;
export type FollowBodyType = z.infer<typeof FollowReqBody>;
export type UpdateMeBodyType = z.infer<typeof UpdateMeReqBody>;

export const UserProfileResData = z
  .object({
    _id: z.string().openapi({ example: "698c0460284cfeb2d9b6b156" }),
    name: z.string().openapi({ example: "Ngọc Shin" }),
    username: z.string().openapi({ example: "shin_coder.99" }),
    email: z.string().openapi({ example: "user@example.com" }),
    dateOfBirth: z.date().openapi({ example: "2005-01-01T00:00:00.000Z" }),
    bio: z.string().openapi({ example: "Fullstack Developer 25/8" }),
    avatar: z.string().openapi({ example: "https://xyz.com/avatar.jpg" }),
    cover: z.string().openapi({ example: "https://xyz.com/cover.jpg" }),
    website: z.string().openapi({ example: "https://github.com/shin-tran" }),
    stats: z.object({
      followersCount: z.number().openapi({ example: 100 }),
      followingCount: z.number().openapi({ example: 50 }),
      tweetCount: z.number().openapi({ example: 10 }),
    }),
    isFollowed: z.boolean().optional().openapi({
      example: true,
      description: "Chỉ xuất hiện khi xem profile người khác và đã đăng nhập",
    }),
    isMyProfile: z.boolean().optional().openapi({
      example: false,
    }),
  })
  .openapi("UserProfileResult");

export const SuccessResData = z
  .object({
    success: z.boolean().openapi({ example: true }),
  })
  .openapi("SuccessResult");

export const FollowListResData = z
  .object({
    users: z.array(UserProfileResData),
    nextCursor: z.number().openapi({ example: "698c046..." }),
    limit: z.number().openapi({ example: 10 }),
  })
  .openapi("FollowListResult");
