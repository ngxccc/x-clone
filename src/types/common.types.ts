import type { TokenType } from "@/constants/enums.js";

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

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
  refresh_token?: string; // Chỉ trả về khi có access_type=offline
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  picture: string;
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
