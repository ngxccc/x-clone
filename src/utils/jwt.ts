import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";
import { TokenPayload } from "@/types/common.types.js";
import { StringValue } from "ms";
import { USERS_MESSAGES } from "@/constants/messages.js";

const { JsonWebTokenError } = jwt;

interface SignTokenParams {
  payload: string | Buffer | object;
  privateKey: string;
  options?: SignOptions;
}

type TokenType = "access" | "refresh" | "email" | "forgotPassword";

const TOKEN_CONFIG = {
  access: {
    secret: () => process.env.JWT_ACCESS_SECRET as string,
    expire: () => (process.env.JWT_ACCESS_EXPIRE || "15m") as StringValue,
    errorMessage: USERS_MESSAGES.ACCESS_TOKEN_INVALID_OR_EXPIRED,
  },
  refresh: {
    secret: () => process.env.JWT_REFRESH_SECRET as string,
    expire: () => (process.env.JWT_REFRESH_EXPIRE || "100d") as StringValue,
    errorMessage: USERS_MESSAGES.REFRESH_TOKEN_INVALID_OR_EXPIRED,
  },
  email: {
    secret: () => process.env.JWT_EMAIL_VERIFY_SECRET as string,
    expire: () => (process.env.JWT_EMAIL_VERIFY_EXPIRE || "10m") as StringValue,
    errorMessage: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_INVALID_OR_EXPIRED,
  },
  forgotPassword: {
    secret: () => process.env.JWT_FORGOT_PASSWORD_SECRET as string,
    expire: () =>
      (process.env.JWT_FORGOT_PASSWORD_EXPIRE || "10m") as StringValue,
    errorMessage: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID_OR_EXPIRED,
  },
} as const;

export const signToken = (payload: TokenPayload, type: TokenType) => {
  const config = TOKEN_CONFIG[type];

  return signTokenIn({
    payload,
    privateKey: config.secret(),
    options: {
      expiresIn: config.expire(),
    },
  });
};

export const verifyToken = (token: string, type: TokenType) => {
  const config = TOKEN_CONFIG[type];

  try {
    return jwt.verify(token, config.secret()) as TokenPayload;
  } catch {
    throw new JsonWebTokenError(config.errorMessage);
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
