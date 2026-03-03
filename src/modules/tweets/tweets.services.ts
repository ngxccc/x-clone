import { NotFoundError } from "@/common/utils/errors";
import { User } from "../users";
import Hashtag from "./models/Hashtag";
import Tweet from "./models/Tweet";
import type { TweetBodyType } from "./tweets.schemas";
import { USERS_MESSAGES } from "@/common/constants/messages";
import type { ClientSession } from "mongoose";
import mongoose from "mongoose";

export class TweetService {
  private async checkAndUpsertHashtags(
    content: string,
    session: ClientSession,
  ) {
    const rawHashtags = content.match(/#[\p{L}\p{N}_]+/gu);

    if (!rawHashtags || rawHashtags.length === 0) return [];

    // Bỏ # ở đầu đi và chuyển về lowercase
    const uniqueHashtags = [
      ...new Set(rawHashtags.map((tag) => tag.slice(1).toLowerCase())),
    ];

    const bulkOps = uniqueHashtags.map((tag) => ({
      updateOne: {
        filter: { name: tag },
        update: {
          $setOnInsert: { name: tag }, // Nếu chưa có thì set name
          $inc: { count: 1 },
          $set: { lastUpdated: new Date() },
        },
        upsert: true, // Không tìm thấy thì Insert
      },
    }));

    await Hashtag.bulkWrite(bulkOps, { session });

    const hashtagsDB = await Hashtag.find({
      name: { $in: uniqueHashtags },
    })
      .session(session)
      .select("_id");

    return hashtagsDB.map((h) => h._id);
  }

  private async checkMentions(content: string, session: ClientSession) {
    const rawMentions = content.match(/@[\p{L}\p{N}_.]+/gu);

    if (!rawMentions || rawMentions.length === 0) return [];

    const uniqueMentions = [
      ...new Set(rawMentions.map((mention) => mention.slice(1).toLowerCase())),
    ];

    const mentionedUser = await User.find({
      username: { $in: uniqueMentions },
    })
      .session(session)
      .select("_id");

    return mentionedUser.map((m) => m._id);
  }

  public async createTweet(userId: string, payload: TweetBodyType) {
    const { content, type, audience, parentId, medias } = payload;

    let createdTweet = null;

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      if (parentId) {
        const incField =
          type === 1
            ? "stats.retweets"
            : type === 2
              ? "stats.comments"
              : "stats.quotes";

        const parentTweet = await Tweet.findByIdAndUpdate(
          parentId,
          {
            $inc: { [incField]: 1 },
          },
          { session, new: true }, // Ép chạy trong session
        );

        if (!parentTweet)
          throw new NotFoundError(
            USERS_MESSAGES.ORIGINAL_POST_NOT_FOUND_OR_DELETED,
          );
      }

      const [hashtags, mentions] = await Promise.all([
        this.checkAndUpsertHashtags(content, session),
        this.checkMentions(content, session),
      ]);

      // Mongoose yêu cầu khi dùng Session với hàm create()
      // Thì Data phải bọc trong mảng [ {...} ], và trả về cũng là một mảng.
      const newTweet = await Tweet.create(
        [
          {
            userId,
            type,
            audience,
            content,
            parentId,
            hashtags,
            mentions,
            medias,
          },
        ],
        { session },
      );

      createdTweet = newTweet[0];
    });

    await session.endSession();

    return createdTweet;
  }
}
