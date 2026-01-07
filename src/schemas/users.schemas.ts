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
    error: USERS_MESSAGES.FOLLOWED_USER_ID_INVALID,
  }),
});

export type FollowBodyType = z.infer<typeof FollowReqBody>;
export type UpdateMeBodyType = z.infer<typeof UpdateMeReqBody>;
