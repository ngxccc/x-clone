import { registerRoute } from "@/common/config/openapi.js";
import {
  ForgotPasswordReqBody,
  LoginData,
  LoginGoogleData,
  LoginGoogleReqBody,
  LoginReqBody,
  RefreshTokenData,
  RefreshTokenReqCookie,
  RegisterData,
  RegisterReqBody,
  ResendVerificationEmailReqBody,
  ResetPasswordReqBody,
  VerifyEmailReqBody,
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

  // Verify email
  registerRoute({
    method: "post",
    path: "/api/v1/auth/verify-email",
    tags: ["Auth"],
    summary: "Xác thực email",
    request: {
      body: {
        content: {
          "application/json": {
            schema: VerifyEmailReqBody,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Xác thực email thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(z.null(), "Xác thực email thành công"),
          },
        },
      },
    },
  });

  // Resend verification email
  registerRoute({
    method: "post",
    path: "/api/v1/auth/resend-verification-email",
    tags: ["Auth"],
    summary: "Gửi lại email xác thực",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ResendVerificationEmailReqBody,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Gửi lại email xác thực thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(
              z.null(),
              "Đã gửi lại email xác thực, vui lòng kiểm tra hộp thư",
            ),
          },
        },
      },
    },
  });

  // Forgot password
  registerRoute({
    method: "post",
    path: "/api/v1/auth/forgot-password",
    tags: ["Auth"],
    summary: "Quên mật khẩu",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ForgotPasswordReqBody,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Gửi email đặt lại mật khẩu thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(
              z.null(),
              "Vui lòng kiểm tra email để đặt lại mật khẩu",
            ),
          },
        },
      },
    },
  });

  // Reset password
  registerRoute({
    method: "post",
    path: "/api/v1/auth/reset-password",
    tags: ["Auth"],
    summary: "Đặt lại mật khẩu",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ResetPasswordReqBody,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Đặt lại mật khẩu thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(z.null(), "Đặt lại mật khẩu thành công"),
          },
        },
      },
    },
  });

  // Refresh token
  registerRoute({
    method: "post",
    path: "/api/v1/auth/refresh-token",
    tags: ["Auth"],
    summary: "Làm mới refresh token",
    request: {
      body: {
        content: {
          "application/json": {
            schema: RefreshTokenReqCookie,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Làm mới Refresh Token thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(
              RefreshTokenData,
              "Làm mới Refresh Token thành công",
            ),
          },
        },
      },
    },
  });

  // Login with Google
  registerRoute({
    method: "post",
    path: "/api/v1/auth/login/google",
    tags: ["Auth"],
    summary: "Đăng nhập với Google",
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginGoogleReqBody,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Đăng nhập với Google thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(
              LoginGoogleData,
              "Đăng nhập với Google thành công",
            ),
          },
        },
      },
    },
  });
};
