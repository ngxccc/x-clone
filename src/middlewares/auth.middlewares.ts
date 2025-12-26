import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { RefreshToken } from "@/models.js";
import { verifyToken } from "@/utils/jwt.js";
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
    const decoded = verifyToken(token, "access");

    // Gán thông tin user vào req để dùng ở Controller sau
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export const refreshTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.body;

  try {
    const decoded = verifyToken(refreshToken, "refresh");
    const foundToken = await RefreshToken.findOne({ token: refreshToken });

    if (!foundToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Refresh token đã sử dụng hoặc không tồn tại",
      });
    }

    // Gán thông tin user vào req để dùng ở Controller sau
    req.decodedRefreshToken = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
