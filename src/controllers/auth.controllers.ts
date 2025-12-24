import { User } from "@/models.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { RegisterBodyType } from "@/requests/auth.requests.js";
import { MongoError } from "@/types/common.types.js";

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === "ngxc@gmail.com" && password === "123123") {
    return res.json({
      message: "Login success!",
    });
  }

  return res.json({
    error: "Login failed!",
  });
};

export const registerController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { username, email, password, dateOfBirth } =
      req.body as RegisterBodyType;

    // Mongoose unique cũng bắt được cái này
    // Nhưng check tay ở đây để trả về message thân thiện hơn.
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(409).json({ message: "Email này đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Dùng .create() để kích hoạt Mongoose Validation & Hooks
    // Không dùng .insertOne vì nó không có Validation
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
    });

    return res.status(201).json({
      message: "Đăng ký thành công!",
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        dateOfBirth: newUser.dateOfBirth,
      },
    });
  } catch (error: unknown) {
    const err = error as MongoError;

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: Object.values(err),
      });
    }

    // 11000 là mã lỗi Duplicate Key Error của MongoDB
    if (err.code === 11000) {
      return res.status(422).json({
        message: "Username hoặc Email đã tồn tại trong hệ thống",
        errors: err.keyValue,
      });
    }

    console.error("Signup Error:", err);
    return res.status(500).json({
      message: "Lỗi server nội bộ",
      error: err.message,
    });
  }
};
