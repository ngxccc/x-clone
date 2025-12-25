import { verifyAccessToken } from "@/utils/jwt.js";
import { NextFunction, Request, Response } from "express";

export const accessTokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Yêu cầu Access Token (Bearer Token)" });
  }

  const token = authHeader.split(" ")[1]!;

  try {
    const decoded = verifyAccessToken(token);

    // Gán thông tin user vào req để dùng ở Controller sau
    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
};
