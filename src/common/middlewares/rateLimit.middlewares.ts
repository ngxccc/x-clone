import { rateLimit } from "express-rate-limit";
import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import RedisStore from "rate-limit-redis";
import { redisConnection } from "../config/redis";

type Data = boolean | number | string;
type RedisReply = Data | Data[];

export const resendEmailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  limit: 1,
  standardHeaders: true, // Trả về header RateLimit-* chuẩn
  legacyHeaders: false, // Disable `X-RateLimit-*`

  store: new RedisStore({
    sendCommand: async (...args: [string, ...string[]]) =>
      (await redisConnection.call(...args)) as RedisReply,
    prefix: "rate-limit:resend-email",
  }),

  handler: (_req, res, _next) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      message: USERS_MESSAGES.TOO_MANY_REQUESTS,
    });
  },

  skip: (req) => req.ip === "::1" || req.ip === "127.0.0.1",
});

export const refreshTokenLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,

  store: new RedisStore({
    sendCommand: async (...args: [string, ...string[]]) =>
      (await redisConnection.call(...args)) as RedisReply,
    prefix: "rate-limit:refresh-token",
  }),

  message: { message: USERS_MESSAGES.TOO_MANY_REQUESTS },
});
