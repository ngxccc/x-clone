import { NotFoundError } from "@/common/utils/errors";
import { Follower, User } from "../users";
import Hashtag from "./models/Hashtag";
import Tweet from "./models/Tweet";
import type { TweetBodyType } from "./schemas";
import { USERS_MESSAGES } from "@/common/constants/messages";
import type { ClientSession } from "mongoose";
import mongoose from "mongoose";
import OutboxEvent from "./models/OutboxEvent";
import { OUTBOX_EVENT_TYPES } from "@/common/constants/enums";
import { ERROR_CODES } from "@/common/constants/error-codes";
import logger from "@/common/utils/logger";
import type { TimelineCacheService } from "@/common/services/redis-timeline.service";

export class TweetService {
  public constructor(
    private readonly timelineCacheService: TimelineCacheService,
  ) {}

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

    // NOTE: Tối ưu cho 100k CCU
    // TRANSACTIONAL OUTBOX PATTERN AND CHANGE DATA CAPTURE
    await session.withTransaction(async () => {
      if (parentId) {
        const parentExists = await Tweet.exists({ _id: parentId }).session(
          session,
        );

        if (!parentExists)
          throw new NotFoundError({
            code: ERROR_CODES.TWEETS.PARENT_NOT_FOUND,
            message: USERS_MESSAGES.ORIGINAL_POST_NOT_FOUND_OR_DELETED,
            details: {
              parentId,
            },
          });

        const eventType =
          type === 1
            ? OUTBOX_EVENT_TYPES.TWEET_RETWEETED
            : type === 2
              ? OUTBOX_EVENT_TYPES.TWEET_COMMENTED
              : OUTBOX_EVENT_TYPES.TWEET_QUOTED;

        await OutboxEvent.create(
          [
            {
              aggregateId: parentId,
              eventType,
              payload: { userId, content },
            },
          ],
          { session },
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

  public async getNewsfeed(
    userId: string,
    limit = 20,
    cursorTimestamp?: number,
  ) {
    const tweetIds = await this.timelineCacheService.getTweetsTimeline(
      userId,
      limit,
      cursorTimestamp,
    );

    if (tweetIds.length === 0) {
      logger.info(
        `⚠️ Cache Miss cho User ${userId}, tiến hành Fallback xuống DB...`,
      );

      const followingList = await Follower.find({ followerId: userId }).select(
        "followedId",
      );
      const followingIds = followingList.map((f) => f.followedId.toString());

      followingIds.push(userId);

      const query: Record<string, unknown> = {
        userId: { $in: followingIds },
      };

      if (cursorTimestamp) query.createdAt = { $lt: new Date(cursorTimestamp) };

      const fallbackTweets = await Tweet.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return fallbackTweets;
    }

    const dbTweets = await Tweet.find({ _id: { $in: tweetIds } }).lean();

    const tweetDictionary = dbTweets.reduce(
      (acc, tweet) => {
        acc[tweet._id.toString()] = tweet;
        return acc;
      },
      {} as Record<string, (typeof dbTweets)[0]>,
    );

    const sortedTweets = tweetIds
      .map((id) => tweetDictionary[id])
      .filter(Boolean); // lọc các tweet undefined

    return sortedTweets;
  }
}
