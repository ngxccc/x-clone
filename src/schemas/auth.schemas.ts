import { requiredString } from "@/utils/validation.js";
import { z } from "zod";

export const RegisterReqBody = z
  .object({
    username: z
      .string("Username là bắt buộc")
      .trim()
      .min(3, "Username phải có ít nhất 3 ký tự")
      .max(255, "Username không được quá 255 ký tự"),
    email: z.email("Email không hợp lệ, vui lòng kiểm tra lại"),
    password: z
      .string("Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: requiredString("Xác nhận mật khẩu là bắt buộc"),
    // z.coerce tự động ép kiểu String -> Date
    dateOfBirth: z.coerce.date({
      error: (issue) =>
        issue.code === "invalid_type"
          ? "Ngày sinh không hợp lệ"
          : "Lỗi không xác định",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"], // Đánh dấu lỗi sẽ hiện ở trường confirmPassword
  });

export const LoginReqBody = z.object({
  email: z.email("Email không hợp lệ, vui lòng kiểm tra lại"),
  password: requiredString("Mật khẩu không được để trống"),
});

export const LogoutReqBody = z.object({
  refreshToken: requiredString("Refresh Token là bắt buộc"),
});

export type LogoutReqType = z.infer<typeof LogoutReqBody>;
export type LoginReqType = z.infer<typeof LoginReqBody>;
export type RegisterReqType = z.infer<typeof RegisterReqBody>;
