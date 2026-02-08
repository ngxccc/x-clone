import mongoose from "mongoose";
const { Schema } = mongoose;

const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tweetId: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Đảm bảo 1 người chỉ like 1 bài 1 lần (Compound Unique Index)
LikeSchema.index({ userId: 1, tweetId: 1 }, { unique: true });

export default mongoose.model("Like", LikeSchema);
