import { registry } from "@/common/config/openapi.js";
import { LoginReqBody, RegisterData, RegisterReqBody } from "./auth.schemas.js";
import {
  BuildSuccessRes,
  EntityErrorRes,
  ErrorRes,
} from "@/common/schemas/common.schemas.js";

export const registerAuthDocs = () => {
  // Register
  registry.registerPath({
    method: "post",
    path: "/api/v1/auth/register",
    tags: ["Auth"],
    summary: "Đăng ký tài khoản mới",
    request: {
      body: {
        description: "Thông tin đăng ký",
        content: {
          "application/json": {
            schema: RegisterReqBody,
          },
        },
      },
    },
    responses: {
      // CREATED
      201: {
        description: "Đăng ký thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(RegisterData, "Đăng ký thành công"),
          },
        },
      },
      // Validation Error
      422: {
        description: "Lỗi Validation",
        content: {
          "application/json": {
            schema: EntityErrorRes,
          },
        },
      },
      // Conflict
      409: {
        description: "Email đã tồn tại",
        content: {
          "application/json": {
            schema: ErrorRes,
          },
        },
      },
      500: {
        description: "Lỗi Server",
        content: {
          "application/json": {
            schema: ErrorRes,
          },
        },
      },
    },
  });

  // Login
  registry.registerPath({
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
      200: { description: "Đăng nhập thành công" },
    },
  });
};
