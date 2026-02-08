import { USERS_MESSAGES } from "@/common/constants/messages.js";
import mongoose from "mongoose";
const { Schema } = mongoose;

const RefreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceInfo: {
      type: String, // VD: "Chrome on Windows 10"
      default: USERS_MESSAGES.UNKNOWN_DEVICE,
    },
    // Thời điểm token hết hạn (Tính toán logic lúc login)
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// TTL Index: Tự động xoá document khi thời gian hiện tại > expiryDate
// (Không cần chạy Cron job dọn rác)
RefreshTokenSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("RefreshToken", RefreshTokenSchema);
