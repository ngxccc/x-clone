import { z } from "zod";

export const RegisterReqBody = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username phải có ít nhất 3 ký tự")
      .max(255, "Username không được quá 255 ký tự"),
    email: z.email("Email không hợp lệ, vui lòng kiểm tra lại!"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string("Xác nhận mật khẩu là bắt buộc"),
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

export type RegisterReqType = z.infer<typeof RegisterReqBody>;
