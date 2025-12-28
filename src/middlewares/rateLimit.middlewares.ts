import { rateLimit } from "express-rate-limit";
import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";

export const resendEmailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 1,
  standardHeaders: true, // Trả về header RateLimit-* chuẩn
  legacyHeaders: false, // Disable `X-RateLimit-*`

  handler: (_req, res, _next) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      message: USERS_MESSAGES.TOO_MANY_REQUESTS,
    });
  },

  skip: (req) => req.ip === "127.0.0.1",
});
