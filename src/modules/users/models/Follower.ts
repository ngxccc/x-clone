import mongoose from "mongoose";
const { Schema } = mongoose;

const FollowerSchema = new Schema({
  followerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người đi follow
  followedId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người được follow
  createdAt: { type: Date, default: Date.now },
});

// Đảm bảo không follow trùng, nguyên tắc Left Prefix
FollowerSchema.index({ followerId: 1, followedId: 1 }, { unique: true });
FollowerSchema.index({ followedId: 1 }); // "Ai đang follow tôi?"

export default mongoose.model("Follower", FollowerSchema);
