import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";
import { TokenPayload } from "@/types/common.types.js";

interface SignTokenParams {
  payload: string | Buffer | object;
  privateKey: string;
  options?: SignOptions;
}

export const signAccessToken = (payload: TokenPayload) => {
  return signToken({
    payload,
    privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
    options: {
      algorithm: "HS256",
      expiresIn:
        (process.env.JWT_ACCESS_EXPIRE as SignOptions["expiresIn"]) || "15m",
    },
  });
};

export const signRefreshToken = (payload: TokenPayload) => {
  return signToken({
    payload,
    privateKey: process.env.JWT_REFRESH_SECRET as string,
    options: {
      algorithm: "HS256",
      expiresIn:
        (process.env.JWT_REFRESH_EXPIRE as SignOptions["expiresIn"]) || "100d",
    },
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as TokenPayload;
  } catch {
    throw new Error("Token không hợp lệ hoặc đã hết hạn!");
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as TokenPayload;
  } catch {
    throw new Error("Refresh Token không hợp lệ hoặc đã hết hạn!");
  }
};

// Promisification (Biến đổi thành Promise)
// Để dùng được await (Tránh Callback Hell)
// DRY - Don't Repeat Yourself
const signToken = ({ payload, privateKey, options }: SignTokenParams) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options || {}, (error, token) => {
      if (error) reject(error);
      resolve(token as string);
    });
  });
};
