import { USER_VERIFY_STATUS } from "@/constants/enums.js";
import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [3, "Username phải dài hơn 3 ký tự"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email không hợp lệ",
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
    forgotPasswordToken: {
      type: String,
      default: "",
      select: false,
    },
    forgotPasswordExpire: {
      type: Date,
      default: null,
      select: false,
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

// Index text để phục vụ chức năng tìm kiếm User
UserSchema.index({ username: "text", email: "text" });

export default mongoose.model("User", UserSchema);
