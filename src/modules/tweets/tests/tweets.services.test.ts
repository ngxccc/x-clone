/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { TweetService } from "../tweets.services";
import Tweet from "../models/Tweet";
import mongoose from "mongoose";
import OutboxEvent from "../models/OutboxEvent";
import type { TweetBodyType } from "../tweets.schemas";
import { ERROR_CODES } from "@/common/constants/error-codes";
import Hashtag from "../models/Hashtag";
import User from "@/modules/users/models/User";

const mockSession = {
  withTransaction: mock(async (cb: () => Promise<void>) => {
    await cb();
  }),
  endSession: mock(),
  commitTransaction: mock(() => Promise.resolve()),
  abortTransaction: mock(() => Promise.resolve()),
};

await mock.module("mongoose", () => ({
  default: {
    startSession: mock(() => Promise.resolve(mockSession)),
    Types: {
      ObjectId: class ObjectId {
        private id: string;
        public constructor(id?: string) {
          this.id = id ?? `mock_id_${Math.random().toString(36).substring(7)}`;
        }
        public toString() {
          return this.id;
        }
      },
    },
  },
}));

await mock.module("../models/Tweet", () => ({
  default: {
    exists: mock(() => ({ session: mock().mockResolvedValue(true) })),
    create: mock(),
    updateOne: mock(),
  },
}));

await mock.module("../models/OutboxEvent", () => ({
  default: {
    create: mock(),
  },
}));

await mock.module("../models/Hashtag", () => ({
  default: {
    bulkWrite: mock(),
    find: mock(() => ({
      session: mock(() => ({ select: mock().mockResolvedValue([]) })),
    })),
  },
}));

await mock.module("@/modules/users", () => ({
  User: {
    find: mock(() => ({
      session: mock(() => ({ select: mock().mockResolvedValue([]) })),
    })),
  },
}));

describe("TweetService - createTweet", () => {
  let tweetService: TweetService;

  beforeEach(() => {
    tweetService = new TweetService();
    mock.restore();
  });

  it("Must throw NotFoundError if create comment but parent tweet was deleted", () => {
    spyOn(Tweet, "exists").mockImplementation((() => ({
      session: () => Promise.resolve(false),
    })) as any);

    const createTweetMock = spyOn(Tweet, "create").mockImplementation(
      (() => ({})) as any,
    );

    const createOutboxMock = spyOn(OutboxEvent, "create").mockImplementation(
      (() => ({})) as any,
    );

    const payload: TweetBodyType = {
      type: 2,
      audience: 0,
      content: "Chửi lộn",
      parentId: new mongoose.Types.ObjectId().toString(),
      medias: [],
    };

    expect(
      tweetService.createTweet("userId123", payload),
    ).rejects.toMatchObject({
      code: ERROR_CODES.TWEETS.PARENT_NOT_FOUND,
    });
    expect(createTweetMock).not.toHaveBeenCalled();
    expect(createOutboxMock).not.toHaveBeenCalled();
  });

  it("Must create tweet successfuly and trigger Outbox Event", async () => {
    spyOn(Tweet, "exists").mockImplementation((() => ({
      session: () => Promise.resolve(true),
    })) as any);

    const createTweetMock = spyOn(Tweet, "create").mockImplementation((() => [
      { _id: "new_comment_id" },
    ]) as any);

    const createOutboxMock = spyOn(OutboxEvent, "create").mockImplementation(
      (() => [{ _id: "new_event_id" }]) as any,
    );

    spyOn(Hashtag, "find").mockImplementation((() => ({
      session: () => ({
        select: () => Promise.resolve([{ _id: "hashtag_id_123" }]),
      }),
    })) as any);

    spyOn(User, "find").mockImplementation((() => ({
      session: () => ({
        select: () => Promise.resolve([{ _id: "user_id_456" }]),
      }),
    })) as any);

    const payload: TweetBodyType = {
      type: 2, // COMMENT
      audience: 0,
      content: "Bổ ích quá anh ơi #boich @ngxc",
      parentId: "real_parent_id_456",
      medias: [],
    };

    await tweetService.createTweet("user_1", payload);

    expect(createTweetMock).toHaveBeenCalledTimes(1);
    expect(createTweetMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          userId: "user_1",
          content: "Bổ ích quá anh ơi #boich @ngxc",
          hashtags: ["hashtag_id_123"],
          mentions: ["user_id_456"],
        }),
      ]),
      expect.anything(), // Bỏ qua cái đối số thứ 2 là { session }
    );

    expect(createOutboxMock).toHaveBeenCalledTimes(1);
    expect(createOutboxMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          aggregateId: "real_parent_id_456",
          eventType: "TWEET_COMMENTED",
        }),
      ]),
      expect.anything(),
    );
  });
});
