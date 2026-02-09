import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import "dotenv/config";
import type { TokenPayload } from "@/common/types/common.types.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import envConfig from "@/common/config/env.js";

const { JsonWebTokenError } = jwt;

interface SignTokenParams {
  payload: string | Buffer | object;
  privateKey: string;
  options?: SignOptions;
}

type TokenType = "access" | "refresh" | "email" | "forgotPassword";

const TOKEN_CONFIG = {
  access: {
    secret: () => envConfig.JWT_ACCESS_SECRET,
    expire: () => envConfig.JWT_ACCESS_EXPIRES_IN,
    errorMessage: USERS_MESSAGES.ACCESS_TOKEN_INVALID_OR_EXPIRED,
  },
  refresh: {
    secret: () => envConfig.JWT_REFRESH_SECRET,
    expire: () => envConfig.JWT_REFRESH_EXPIRES_IN,
    errorMessage: USERS_MESSAGES.REFRESH_TOKEN_INVALID_OR_EXPIRED,
  },
  email: {
    secret: () => envConfig.JWT_EMAIL_VERIFY_SECRET,
    expire: () => envConfig.JWT_EMAIL_VERIFY_EXPIRES_IN,
    errorMessage: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_INVALID_OR_EXPIRED,
  },
  forgotPassword: {
    secret: () => envConfig.JWT_FORGOT_PASSWORD_SECRET,
    expire: () => envConfig.JWT_FORGOT_PASSWORD_EXPIRES_IN,
    errorMessage: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID_OR_EXPIRED,
  },
} as const;

export class TokenService {
  public signToken(payload: TokenPayload, type: TokenType) {
    const config = TOKEN_CONFIG[type];

    return this.signTokenIn({
      payload,
      privateKey: config.secret(),
      options: {
        expiresIn: config.expire(),
      },
    });
  }

  public verifyToken(token: string, type: TokenType) {
    const config = TOKEN_CONFIG[type];

    try {
      return jwt.verify(token, config.secret()) as TokenPayload;
    } catch {
      throw new JsonWebTokenError(config.errorMessage);
    }
  }

  // Promisification (Biến đổi thành Promise)
  // Để dùng được await (Tránh Callback Hell)
  private signTokenIn({ payload, privateKey, options }: SignTokenParams) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, privateKey, options ?? {}, (error, token) => {
        if (error) reject(error);
        resolve(token!);
      });
    });
  }
}
