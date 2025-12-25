export interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export interface TokenPayload {
  userId: string;
  role: number;
}
