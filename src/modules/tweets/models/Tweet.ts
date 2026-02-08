import mongoose from "mongoose";
const { Schema } = mongoose;

const TweetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: Number,
      enum: [0, 1, 2, 3], // 0: Tweet, 1: Retweet, 2: Comment, 3: Quote
      required: true,
    },
    audience: {
      type: Number,
      enum: [0, 1], // 0: Everyone, 1: Twitter Circle
      default: 0,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    // Đệ quy: Tham chiếu đến chính bảng Tweet (Dùng cho Retweet/Comment/Quote)
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      default: null,
      index: true,
    },
    hashtags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hashtag",
      },
    ],
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    medias: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],

    // --- TÍNH NĂNG EDIT ---
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },

    // Cache số liệu tương tác (Optimized for Read)
    stats: {
      likes: { type: Number, default: 0 },
      retweets: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      quotes: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Tweet", TweetSchema);
