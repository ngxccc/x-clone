import { TWEET_AUDIENCE, TWEET_TYPES } from "@/common/constants/enums";
import { USERS_MESSAGES } from "@/common/constants/messages";
import mongoose from "mongoose";
import z from "zod";

export const TweetReqBody = z
  .object({
    type: z
      .enum(TWEET_TYPES)
      .openapi({ description: "0: Tweet, 1: Retweet, 2: Comment, 3: Quote" }),
    audience: z
      .enum(TWEET_AUDIENCE)
      .default(TWEET_AUDIENCE.EVERYONE)
      .openapi({ description: "0: Everyone, 1: Circle" }),
    content: z.string().trim().openapi({
      description: "Nội dung bài viết",
      example: "Học NodeJS nhức đầu quá anh em êi #NodeJS @shin_coder",
    }),
    parentId: z
      .string()
      .refine((val) => mongoose.isValidObjectId(val), {
        error: "parentId không hợp lệ",
      })
      .nullable()
      .default(null)
      .openapi({
        description: "ID của bài viết gốc (nếu là Retweet/Comment/Quote)",
      }),
    medias: z
      .array(
        z.object({
          url: z.url(),
          type: z.enum(["image", "video"]),
        }),
      )
      .default([])
      .superRefine((medias, ctx) => {
        if (medias.length === 0) return;

        const videoCount = medias.filter((m) => m.type === "video").length;
        const imageCount = medias.filter((m) => m.type === "image").length;

        if (videoCount > 0) {
          if (videoCount > 1)
            ctx.addIssue({
              code: "custom",
              message: USERS_MESSAGES.MAX_VIDEO_ATTACHMENT_EXCEEDED,
            });
          if (imageCount > 3)
            ctx.addIssue({
              code: "custom",
              message: USERS_MESSAGES.MAX_MIXED_ATTACHMENTS_EXCEEDED,
            });
          return;
        }

        if (imageCount > 4) {
          ctx.addIssue({
            code: "custom",
            message: USERS_MESSAGES.MAX_IMAGE_ATTACHMENTS_EXCEEDED,
          });
        }
      })
      .openapi({
        description: "Mảng URL ảnh/video đã upload thành công",
      }),
  })
  .refine(
    (data) => {
      if (
        (
          [
            TWEET_TYPES.RETWEET,
            TWEET_TYPES.COMMENT,
            TWEET_TYPES.QUOTE,
          ] as number[]
        ).includes(data.type) &&
        !data.parentId
      )
        return false;
      return true;
    },
    {
      error: "Phải truyền parentId khi Retweet, Comment hoặc Quote",
      path: ["parentId"],
    },
  )
  .openapi("TweetRequest");

export type TweetBodyType = z.infer<typeof TweetReqBody>;

export const TweetData = z
  .object({
    _id: z
      .string()
      .openapi({ example: "65f0a...123", description: "ObjectId của Tweet" }),
    userId: z
      .string()
      .openapi({ example: "65f0a...456", description: "ObjectId của tác giả" }),
    type: z.number().openapi({
      example: 0,
      description: "0: Tweet, 1: Retweet, 2: Comment, 3: Quote",
    }),
    audience: z
      .number()
      .openapi({ example: 0, description: "0: Everyone, 1: Circle" }),
    content: z.string().openapi({
      example: "Học NodeJS trầm cảm quá ae 🐸 #nodejs @shin_coder",
    }),
    parentId: z.string().nullable().openapi({
      example: null,
      description: "Trỏ đến Tweet gốc nếu là Comment/Retweet",
    }),
    hashtags: z.array(z.string()).openapi({
      example: ["65f0a...789"],
      description: "Mảng ObjectId của Hashtags",
    }),
    mentions: z.array(z.string()).openapi({
      example: ["65f0a...abc"],
      description: "Mảng ObjectId của Users bị tag",
    }),
    medias: z
      .array(
        z.object({
          url: z.string(),
          type: z.enum(["image", "video"]),
        }),
      )
      .openapi({
        example: [
          { url: "https://x-clone.com/static/image/123.jpg", type: "image" },
        ],
      }),
    isEdited: z.boolean().openapi({ example: false }),
    editedAt: z
      .date()
      .nullable()
      .openapi({ example: null, type: "string", format: "date-time" }),
    stats: z
      .object({
        likes: z.number(),
        retweets: z.number(),
        comments: z.number(),
        quotes: z.number(),
        views: z.number(),
      })
      .openapi({
        example: { likes: 0, retweets: 0, comments: 0, quotes: 0, views: 0 },
      }),
    createdAt: z.date().openapi({
      example: "2026-03-03T12:00:00.000Z",
      type: "string",
      format: "date-time",
    }),
    updatedAt: z.date().openapi({
      example: "2026-03-03T12:00:00.000Z",
      type: "string",
      format: "date-time",
    }),
  })
  .openapi("TweetResponseData");
