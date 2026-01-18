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

export const UPLOAD_PURPOSE = {
  AVATAR: 0,
  COVER: 1,
  TWEET: 2,
} as const;

export type UploadPurposeType =
  (typeof UPLOAD_PURPOSE)[keyof typeof UPLOAD_PURPOSE];

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export type UserVerifyStatusType =
  (typeof USER_VERIFY_STATUS)[keyof typeof USER_VERIFY_STATUS];
