import { USERS_MESSAGES } from "@/constants/messages.js";
import mongoose from "mongoose";
import z from "zod";

export const UpdateMeReqBody = z.object({
  username: z
    .string()
    .trim()
    .min(3, USERS_MESSAGES.USERNAME_MIN_LENGTH)
    .max(255, USERS_MESSAGES.USERNAME_MAX_LENGTH)
    // Regex: Chỉ cho phép chữ, số, _ và .
    .regex(/^[a-zA-Z0-9._]+$/, USERS_MESSAGES.USERNAME_INVALID)
    .optional(),
  dateOfBirth: z.coerce
    .date({
      error: (issue) =>
        issue.code === "invalid_type"
          ? USERS_MESSAGES.DATE_OF_BIRTH_INVALID
          : USERS_MESSAGES.UNKNOWN_ERROR,
    })
    .optional(),
  bio: z.string().trim().max(160, USERS_MESSAGES.BIO_TOO_LONG).optional(),
  website: z.url(USERS_MESSAGES.WEBSITE_INVALID).optional(),
  avatar: z.string().max(400).optional(),
});

export const FollowReqBody = z.object({
  followedUserId: z.string().refine((val) => mongoose.isValidObjectId(val), {
    error: USERS_MESSAGES.USER_ID_INVALID,
  }),
});

export const UnfollowReqParams = z.object({
  followedUserId: z.string().refine((val) => mongoose.isValidObjectId(val), {
    error: USERS_MESSAGES.USER_ID_INVALID,
  }),
});

export const GetFollowersReqParams = z.object({
  userId: z.string().refine((val) => mongoose.isValidObjectId(val), {
    error: USERS_MESSAGES.USER_ID_INVALID,
  }),
});

export const PaginationReqQuery = z.object({
  limit: z.coerce
    .number()
    .min(1, USERS_MESSAGES.LIMIT_MIN_LENGTH)
    .max(100, USERS_MESSAGES.LIMIT_MAX_LENGTH)
    .default(10),
  page: z.coerce.number().min(1, USERS_MESSAGES.PAGE_MIN_LENGTH).default(1),
});

export type GetFollowersParamsType = z.infer<typeof GetFollowersReqParams>;
export type PaginationQueryType = z.infer<typeof PaginationReqQuery>;
export type UnfollowParamsType = z.infer<typeof UnfollowReqParams>;
export type FollowBodyType = z.infer<typeof FollowReqBody>;
export type UpdateMeBodyType = z.infer<typeof UpdateMeReqBody>;
