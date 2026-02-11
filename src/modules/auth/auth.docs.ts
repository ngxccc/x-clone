import { registerRoute } from "@/common/config/openapi.js";
import {
  LoginData,
  LoginReqBody,
  RegisterData,
  RegisterReqBody,
} from "./auth.schemas.js";
import { BuildSuccessRes } from "@/common/schemas/common.schemas.js";
import z from "zod";

export const registerAuthDocs = () => {
  // Register
  registerRoute({
    method: "post",
    path: "/api/v1/auth/register",
    tags: ["Auth"],
    summary: "Đăng ký tài khoản",
    isPublic: true,
    request: {
      body: {
        content: {
          "application/json": {
            schema: RegisterReqBody,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Đăng ký thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(RegisterData, "Đăng ký thành công"),
          },
        },
      },
    },
  });

  // Login
  registerRoute({
    method: "post",
    path: "/api/v1/auth/login",
    tags: ["Auth"],
    summary: "Đăng nhập",
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginReqBody,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Đăng nhập thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(LoginData, "Đăng nhập thành công"),
          },
        },
      },
    },
  });

  // Logout
  registerRoute({
    method: "post",
    path: "/api/v1/auth/logout",
    tags: ["Auth"],
    summary: "Đăng xuất",
    responses: {
      200: {
        description: "Đăng xuất thành công",
        content: { "application/json": { schema: BuildSuccessRes(z.null()) } },
      },
    },
  });
};
