export const USER_VERIFY_STATUS = {
  UNVERIFIED: 0,
  VERIFIED: 1,
  BANNED: 2,
} as const;

export const TOKEN_TYPES = {
  ACCESS_TOKEN: 0,
  REFRESH_TOKEN: 1,
  EMAIL_VERIFY_TOKEN: 2,
  FORGOT_PASSWORD_TOKEN: 3,
} as const;

export const MEDIA_TYPES = {
  IMAGE: 0,
  VIDEO: 1,
} as const;

export const VIDEO_STATUS = {
  SUCCESS: "success",
  FAILED: "failed",
  PENDING: "pending",
  PROCESSING: "processing",
} as const;

export const UPLOAD_PURPOSE = {
  AVATAR: 0,
  COVER: 1,
  TWEET: 2,
} as const;

export const CONNECTION_STATES = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3,
  UNINITIALIZED: 99,
} as const;

export const TWEET_TYPES = {
  TWEET: 0,
  RETWEET: 1,
  COMMENT: 2,
  QUOTE: 3,
} as const;

export const TWEET_AUDIENCE = {
  EVERYONE: 0,
  TWEETER_CIRCLE: 1,
} as const;

export const OUTBOX_STATUS_TYPES = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  DONE: "DONE",
  FAILED: "FAILED",
} as const;

export const OUTBOX_EVENT_TYPES = {
  TWEET_RETWEETED: "TWEET_RETWEETED",
  TWEET_COMMENTED: "TWEET_COMMENTED",
  TWEET_QUOTED: "TWEET_QUOTED",
} as const;

export type UploadPurposeType =
  (typeof UPLOAD_PURPOSE)[keyof typeof UPLOAD_PURPOSE];

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export type UserVerifyStatusType =
  (typeof USER_VERIFY_STATUS)[keyof typeof USER_VERIFY_STATUS];
