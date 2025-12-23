import mongoose from "mongoose";
const { Schema } = mongoose;

const FollowerSchema = new Schema({
  follower_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người đi follow
  followed_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người được follow
  created_at: { type: Date, default: Date.now },
});

// Đảm bảo không follow trùng, nguyên tắc Left Prefix
FollowerSchema.index({ follower_id: 1, followed_id: 1 }, { unique: true });
FollowerSchema.index({ followed_id: 1 }); // "Ai đang follow tôi?"

export default mongoose.model("Follower", FollowerSchema);
