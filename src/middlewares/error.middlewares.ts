import { NextFunction, Request, Response } from "express";
import { MongoError } from "@/types/common.types.js"; // Import type bạn đã định nghĩa

export const defaultErrorHandler = (
  err: MongoError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.name === "ValidationError") {
    // TODO: Sẽ format cho dễ nhìn sau
    const errors = Object.values(err);

    return res.status(422).json({
      message: "Lỗi validation dữ liệu (Mongoose)",
      errors,
    });
  }

  // 11000 là mã lỗi Duplicate Key Error của MongoDB
  if (err.code === 11000) {
    return res.status(409).json({
      message: `${err.keyValue} đã tồn tại trong hệ thống`,
      errors: err.keyValue,
    });
  }

  // Các lỗi không xác định (Internal Server Error)
  console.error("Error:", err);
  return res.status(500).json({
    message: "Lỗi server nội bộ",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};
