import { redisConnection } from "../config/redis";
import logger from "../utils/logger";

export class TimelineCacheService {
  private readonly MAX_TIMELINE_SIZE = 800;

  public async pushTweetToTimeline(
    userId: string,
    tweetId: string,
    timestamp: number,
  ) {
    const key = `timeline:${userId}`;

    try {
      // Atomic chống Race Condition
      const pipline = redisConnection.pipeline();

      // Thêm vào ZSET, score là timestamp để sort, tweetId là member
      pipline.zadd(key, timestamp, tweetId);

      // ZSET sắp xếp mặc định theo Score từ NHỎ đến LỚN (Cũ nhất ở rank 0).
      // Để giữ lại 800 bài MỚI NHẤT (Score lớn nhất), ta phải xóa các bài CŨ NHẤT.
      // Rank 0 là cũ nhất. Rank -1 là mới nhất.
      // => Xóa từ rank 0 đến rank -801 (Tức là vứt hết các bài cũ hơn bài thứ 800).
      pipline.zremrangebyrank(key, 0, -(this.MAX_TIMELINE_SIZE + 1));

      // Set TTL cho Key để giải phóng RAM nếu User này offline quá 30 ngày (Ghost User)
      pipline.expire(key, 30 * 24 * 60 * 60);

      await pipline.exec();
    } catch (error) {
      // lỗi ở cache không quan trọng nên chỉ cần log
      logger.error(
        error,
        `❌ Lỗi đẩy Tweet ${tweetId} vào timeline của User ${userId}:`,
      );
    }
  }

  public async getTweetsTimeline(
    userId: string,
    limit = 20,
    cursorTimestamp?: number,
  ) {
    const key = `timeline:${userId}`;

    try {
      // Nếu không có cursor (Mở app lần đầu), lấy từ bài mới nhất (+inf)
      // Nếu có cursor, phải lấy những bài CŨ HƠN cursor (Tức là Score < cursorTimestamp)
      // Cú pháp của IORedis: dùng '(' đằng trước để lấy ĐỘC QUYỀN (Exclusive - Dấu Nhỏ Hơn Hẳn)
      const maxScore = cursorTimestamp ? `(${cursorTimestamp}` : "+inf";
      const minScore = "-inf";

      const tweetIds = await redisConnection.zrevrangebyscore(
        key,
        maxScore,
        minScore,
        "LIMIT",
        0,
        limit,
      );

      return tweetIds;
    } catch (error) {
      logger.error(error, `❌ Lỗi móc Timeline từ Redis của User ${userId}:`);
      return [];
    }
  }
}
