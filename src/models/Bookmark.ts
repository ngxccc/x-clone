import mongoose from "mongoose";
const { Schema } = mongoose;

const BookmarkSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tweet_id: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
  created_at: { type: Date, default: Date.now },
});

// Đảm bảo không bookmark trùng
BookmarkSchema.index({ user_id: 1, tweet_id: 1 }, { unique: true });

export default mongoose.model("Bookmark", BookmarkSchema);
