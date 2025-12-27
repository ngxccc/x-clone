import { USER_VERIFY_STATUS } from "@/constants/enums.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [3, USERS_MESSAGES.USERNAME_MIN_LENGTH],
      maxLength: [255, USERS_MESSAGES.USERNAME_MAX_LENGTH],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        USERS_MESSAGES.EMAIL_IS_INVALID,
      ],
    },
    password: {
      type: String,
      required: true,
      select: false, // Ẩn password khi query
    },
    dateOfBirth: {
      type: Date, // Múi giờ UTC (GMT+0)
      required: true,
    },
    emailVerifyToken: {
      type: String,
      default: "",
      select: false,
    },
    forgotPasswordToken: {
      type: String,
      default: "",
      select: false,
    },
    verify: {
      type: Number,
      enum: Object.values(USER_VERIFY_STATUS),
      default: USER_VERIFY_STATUS.UNVERIFIED,
    },
    bio: {
      type: String,
      default: "",
      maxLength: 160,
    },
    avatar: {
      type: String,
      default: "", // URL ảnh
    },
    website: {
      type: String,
      default: "",
    },
    // Cache số liệu để hiển thị nhanh trên Profile
    stats: {
      followersCount: { type: Number, default: 0 },
      followingCount: { type: Number, default: 0 },
      tweetCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  },
);

UserSchema.index({
  username: 1,
  email: 1,
  emailVerifyToken: 1,
  forgotPasswordToken: 1,
});

export default mongoose.model("User", UserSchema);
