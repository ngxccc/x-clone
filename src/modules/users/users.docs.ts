import { registerRoute } from "@/common/config/openapi.js";
import { BuildSuccessRes } from "@/common/schemas/common.schemas.js";
import { z } from "zod";
import {
  ChangePasswordReqBody,
  FollowListResData,
  FollowReqBody,
  SuccessResData,
  UpdateMeReqBody,
  UserProfileResData,
} from "./users.schemas.js";

export const registerUsersDocs = () => {
  // Me
  registerRoute({
    method: "get",
    path: "/api/v1/users/me",
    tags: ["Users"],
    summary: "Lấy thông tin cá nhân",
    isPublic: false,
    responses: {
      200: {
        description: "Thành công",
        content: {
          "application/json": { schema: BuildSuccessRes(UserProfileResData) },
        },
      },
    },
  });

  // Me
  registerRoute({
    method: "patch",
    path: "/api/v1/users/me",
    tags: ["Users"],
    summary: "Cập nhật thông tin cá nhân",
    isPublic: false,
    request: {
      body: { content: { "application/json": { schema: UpdateMeReqBody } } },
    },
    responses: {
      200: {
        description: "Thành công",
        content: {
          "application/json": { schema: BuildSuccessRes(UserProfileResData) },
        },
      },
    },
  });

  // Username
  registerRoute({
    method: "get",
    path: "/api/v1/users/{username}",
    tags: ["Users"],
    summary: "Lấy profile user theo username",
    isPublic: true,
    request: {
      params: z.object({
        username: z.string().openapi({ example: "shin_coder.99" }),
      }),
    },
    responses: {
      200: {
        description: "Thành công",
        content: {
          "application/json": { schema: BuildSuccessRes(UserProfileResData) },
        },
      },
    },
  });

  // Follow
  registerRoute({
    method: "post",
    path: "/api/v1/users/follow",
    tags: ["Users"],
    summary: "Theo dõi một user",
    isPublic: false,
    request: {
      body: { content: { "application/json": { schema: FollowReqBody } } },
    },
    responses: {
      200: {
        description: "Thành công",
        content: {
          "application/json": { schema: BuildSuccessRes(SuccessResData) },
        },
      },
    },
  });

  // /follow/:followedUserId
  registerRoute({
    method: "delete",
    path: "/api/v1/users/follow/{followedUserId}",
    tags: ["Users"],
    summary: "Hủy theo dõi một user",
    isPublic: false,
    request: {
      params: z.object({
        followedUserId: z.string().openapi({ example: "698c046..." }),
      }),
    },
    responses: {
      200: {
        description: "Thành công",
        content: {
          "application/json": { schema: BuildSuccessRes(SuccessResData) },
        },
      },
    },
  });

  // /:userId/followers
  registerRoute({
    method: "get",
    path: "/api/v1/users/{userId}/followers",
    tags: ["Users"],
    summary: "Lấy danh sách người theo dõi",
    isPublic: true,
    request: {
      params: z.object({
        userId: z.string().openapi({ example: "698c046..." }),
      }),
      query: z.object({
        limit: z.coerce.number().optional().openapi({ example: 10 }),
        page: z.coerce.number().optional().openapi({ example: 1 }),
      }),
    },
    responses: {
      200: {
        description: "Thành công",
        content: {
          "application/json": { schema: BuildSuccessRes(FollowListResData) },
        },
      },
    },
  });

  // /:userId/following
  registerRoute({
    method: "get",
    path: "/api/v1/users/{userId}/following",
    tags: ["Users"],
    summary: "Lấy danh sách người đang theo dõi",
    isPublic: true,
    request: {
      params: z.object({
        userId: z.string().openapi({ example: "698c046..." }),
      }),
      query: z.object({
        limit: z.coerce.number().optional().openapi({ example: 10 }),
        page: z.coerce.number().optional().openapi({ example: 1 }),
      }),
    },
    responses: {
      200: {
        description: "Thành công",
        content: {
          "application/json": { schema: BuildSuccessRes(FollowListResData) },
        },
      },
    },
  });

  // /change-password
  registerRoute({
    method: "put",
    path: "/api/v1/users/change-password",
    tags: ["Users"],
    summary: "Đổi mật khẩu",
    isPublic: false,
    request: {
      body: {
        content: { "application/json": { schema: ChangePasswordReqBody } },
      },
    },
    responses: {
      200: {
        description: "Thành công",
        content: {
          "application/json": { schema: BuildSuccessRes(SuccessResData) },
        },
      },
    },
  });
};
