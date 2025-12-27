import jwt, { JsonWebTokenError, SignOptions } from "jsonwebtoken";
import "dotenv/config";
import { TokenPayload } from "@/types/common.types.js";
import { StringValue } from "ms";
import { USERS_MESSAGES } from "@/constants/messages.js";

interface SignTokenParams {
  payload: string | Buffer | object;
  privateKey: string;
  options?: SignOptions;
}

export const signToken = (
  payload: TokenPayload,
  type: "access" | "refresh",
) => {
  const isAccessToken = type === "access";

  return signTokenIn({
    payload,
    privateKey: (isAccessToken
      ? process.env.JWT_ACCESS_SECRET
      : process.env.JWT_REFRESH_SECRET) as string,
    options: {
      expiresIn: (isAccessToken
        ? process.env.JWT_ACCESS_EXPIRE || "15m"
        : process.env.JWT_REFRESH_EXPIRE || "100d") as StringValue,
    },
  });
};

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const isAccessToken = type === "access";

  try {
    return jwt.verify(
      token,
      (isAccessToken
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_REFRESH_SECRET) as string,
    ) as TokenPayload;
  } catch {
    if (isAccessToken)
      throw new JsonWebTokenError(
        USERS_MESSAGES.ACCESS_TOKEN_INVALID_OR_EXPIRED,
      );
    throw new JsonWebTokenError(
      USERS_MESSAGES.REFRESH_TOKEN_INVALID_OR_EXPIRED,
    );
  }
};

// Promisification (Biến đổi thành Promise)
// Để dùng được await (Tránh Callback Hell)
const signTokenIn = ({ payload, privateKey, options }: SignTokenParams) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options || {}, (error, token) => {
      if (error) reject(error);
      resolve(token as string);
    });
  });
};
