import { NextFunction, Request, Response } from "express";
import { RegisterReqType } from "@/schemas/auth.schemas.js";
import usersService from "@/services/users.services.js";
import authService from "@/services/auth.services.js";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(
      email,
      password,
      req.headers["user-agent"],
    );

    return res.status(200).json({
      message: "Đăng nhập thành công!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as RegisterReqType;

    if (await usersService.checkEmailExist(email)) {
      return res.status(409).json({ message: "Email này đã được sử dụng!" });
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
