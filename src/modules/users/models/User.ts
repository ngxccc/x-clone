import { USER_VERIFY_STATUS } from "@/common/constants/enums.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, USERS_MESSAGES.NAME_MIN_LENGTH],
      maxLength: [100, USERS_MESSAGES.NAME_MAX_LENGTH],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, USERS_MESSAGES.USERNAME_MIN_LENGTH],
      maxLength: [255, USERS_MESSAGES.USERNAME_MAX_LENGTH],
      // Chỉ cho phép chữ, số, _ và .
      match: [/^[a-zA-Z0-9._]+$/, USERS_MESSAGES.USERNAME_IS_INVALID],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        USERS_MESSAGES.EMAIL_IS_INVALID,
      ],
    },
    password: {
      type: String,
      required: true,
      select: false, // Ẩn password khi query
      match: [
        // Chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số, 1 ký tự đặc biệt
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/,
        USERS_MESSAGES.PASSWORD_NOT_STRONG,
      ],
    },
    googleId: {
      type: String,
      default: null,
      select: false,
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
    cover: {
      type: String,
      default: "", // URL ảnh
    },
    website: {
      type: String,
      default: "",
      lowercase: true,
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

// Pre-save Hook: Chạy trước khi save()
// Dùng func thường để có this
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
});

export default mongoose.model("User", UserSchema);
