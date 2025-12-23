import mongoose from "mongoose";
const { Schema } = mongoose;

const LikeSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tweet_id: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
  created_at: { type: Date, default: Date.now },
});

// Đảm bảo 1 người chỉ like 1 bài 1 lần (Compound Unique Index)
LikeSchema.index({ user_id: 1, tweet_id: 1 }, { unique: true });

export default mongoose.model("Like", LikeSchema);
