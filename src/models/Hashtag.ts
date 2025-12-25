import mongoose from "mongoose";
const { Schema } = mongoose;

const HashtagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  // Quan trọng cho Trending: Tag nào được dùng nhiều nhất GẦN ĐÂY
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Index sort cho Trending: Lấy count cao nhất + thời gian mới nhất
HashtagSchema.index({ count: -1, lastUpdated: -1 });

export default mongoose.model("Hashtag", HashtagSchema);
