import mongoose from "mongoose";
import "dotenv/config";
import envConfig from "@/common/config/env.js";
import logger from "./logger";
import { RefreshToken } from "@/modules/auth";
import { Follower, User } from "@/modules/users";
import { Bookmark, Hashtag, Like, Tweet } from "@/modules/tweets";

const syncIndexes = async () => {
  try {
    await mongoose.connect(envConfig.MONGO_URI);
    logger.info("Connected to DB for Indexing...");

    // Các model cần đánh index
    // Promise.all giúp chạy song song cho nhanh
    await Promise.all([
      User.createIndexes(),
      RefreshToken.createIndexes(),
      Tweet.createIndexes(),
      Hashtag.createIndexes(),
      Like.createIndexes(),
      Bookmark.createIndexes(),
      Follower.createIndexes(),
    ]);

    logger.info("✅ Sync The Index Successfully!");
    process.exit(0);
  } catch (error) {
    logger.error(error, "❌ Indexing error:");
    process.exit(1);
  }
};

void syncIndexes();
