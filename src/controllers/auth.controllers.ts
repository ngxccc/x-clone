import { NextFunction, Request, Response } from "express";
import { RegisterReqType } from "@/schemas/auth.schemas.js";
import usersService from "@/services/users.services.js";

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === "ngxc@gmail.com" && password === "123123") {
    return res.status(200).json({
      message: "Đăng nhập thành công!",
    });
  }

  return res.status(401).json({
    message: "Sai thông tin đăng nhập",
    error: "Email hoặc mật khẩu không chính xác",
  });
};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { email } = req.body as RegisterReqType;

    if (await usersService.checkEmailExist(email)) {
      return res.status(409).json({ message: "Email này đã được sử dụng" });
    }

    const newUser = await usersService.register(req.body);

    return res.status(201).json({
      message: "Đăng ký thành công!",
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        dateOfBirth: newUser.dateOfBirth,
      },
    });
  } catch (error) {
    // Đẩy toàn bộ lỗi sang defaultErrorHandler xử lý
    next(error);
  }
};
