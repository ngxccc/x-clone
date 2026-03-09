import { USERS_MESSAGES } from "@/common/constants/messages";
import mongoose from "mongoose";
import { z } from "zod";

export const NewsfeedReqQuery = z.object({
  limit: z.coerce
    .number()
    .min(1, USERS_MESSAGES.LIMIT_MIN_LENGTH)
    .max(100, USERS_MESSAGES.LIMIT_MAX_LENGTH)
    .default(20)
    .openapi({ example: 10, description: "Số lượng bài viết trên 1 lần tải" }),
  cursor: z
    .string()
    .optional()
    .refine((val) => mongoose.isValidObjectId(val), {
      error: USERS_MESSAGES.TWEET_ID_INVALID,
    })
    .openapi({
      example: "698c0460284cfeb2d9b6b156",
      description: "ID của bài viết cuối cùng ở lần gọi trước",
    }),
});

export type NewsfeedQuery = z.infer<typeof NewsfeedReqQuery>;
