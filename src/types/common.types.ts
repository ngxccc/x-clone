import { TokenType } from "@/constants/enums.js";

export interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export interface TokenPayload {
  userId: string;
  tokenType: TokenType;
  iat?: number;
  exp?: number;
}

// Declaration Merging (Gộp định nghĩa)
declare module "express" {
  interface Request {
    decodedAccessToken?: TokenPayload;
    decodedRefreshToken?: TokenPayload;
    decodedEmailVerifyToken?: TokenPayload;
    decodedForgotPasswordToken?: TokenPayload;
    validatedQuery?: Record<string, unknown>;
  }
}
