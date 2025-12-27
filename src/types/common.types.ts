import { TokenType } from "@/constants/enums.js";

export interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export interface TokenPayload {
  userId: string;
  tokenType: TokenType;
}

// Declaration Merging (Gộp định nghĩa)
declare module "express" {
  interface Request {
    decodedAccessToken?: TokenPayload;
    decodedRefreshToken?: TokenPayload;
    decodedEmailVerifyToken?: TokenPayload;
  }
}
