import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [5, "Username phải dài hơn 5 ký tự"],
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
      select: false, // Mặc định ẩn password khi query
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
      followers_count: { type: Number, default: 0 },
      following_count: { type: Number, default: 0 },
      tweet_count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  },
);

// Index text để phục vụ chức năng tìm kiếm User
UserSchema.index({ username: "text", email: "text" });

export default mongoose.model("User", UserSchema);
