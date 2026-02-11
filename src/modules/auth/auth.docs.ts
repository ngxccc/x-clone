import { registry } from "@/common/config/openapi.js";
import { LoginReqBody, RegisterReqBody, RegisterRes } from "./auth.schemas.js";

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
      201: {
        description: "Đăng ký thành công",
        content: {
          "application/json": {
            schema: RegisterRes,
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
            schema: LoginReqBody, // 👈 ĐẤU DÂY
          },
        },
      },
    },
    responses: {
      200: { description: "Đăng nhập thành công" },
    },
  });
};
