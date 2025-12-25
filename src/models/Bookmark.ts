import mongoose from "mongoose";
const { Schema } = mongoose;

const BookmarkSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tweetId: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Đảm bảo không bookmark trùng
BookmarkSchema.index({ userId: 1, tweetId: 1 }, { unique: true });

export default mongoose.model("Bookmark", BookmarkSchema);
