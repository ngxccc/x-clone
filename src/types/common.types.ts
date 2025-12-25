import { TokenType } from "@/constants/enums.js";
import { Types } from "mongoose";

export interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export interface TokenPayload {
  userId: Types.ObjectId;
  tokenType: TokenType;
}

// Declaration Merging (Gộp định nghĩa)
declare module "express" {
  interface Request {
    user?: TokenPayload;
  }
}
