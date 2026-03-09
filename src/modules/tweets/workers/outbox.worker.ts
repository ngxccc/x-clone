import {
  OUTBOX_EVENT_TYPES,
  OUTBOX_STATUS_TYPES,
} from "@/common/constants/enums";
import OutboxEvent from "../models/OutboxEvent";
import Tweet from "../models/Tweet";
import logger from "@/common/utils/logger";
import { randomUUID } from "node:crypto";
import envConfig from "@/common/config/env";

export class OutboxWorker {
  private isProcessing = false;
  private readonly workerId = randomUUID();

  private process = async () => {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      let hasMoreEvents = true;
      let processedCount = 0;

      // lấy từng cái event cũ nhất ra rồi set status: processing
      while (hasMoreEvents && processedCount < 100) {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        const event = await OutboxEvent.findOneAndUpdate(
          {
            $or: [
              { status: OUTBOX_STATUS_TYPES.PENDING },
              {
                status: OUTBOX_STATUS_TYPES.PROCESSING,
                lockedAt: { $lt: twoMinutesAgo },
              },
            ],
          },
          {
            $set: {
              status: OUTBOX_STATUS_TYPES.PROCESSING,
              lockedBy: this.workerId,
              lockedAt: new Date(),
            },
          },
          { sort: { createdAt: 1 }, returnDocument: "after" }, // tăng dần và nhận doc sau khi update
        );

        if (!event) {
          hasMoreEvents = false;
          continue;
        }

        try {
          const incField =
            event.eventType === OUTBOX_EVENT_TYPES.TWEET_COMMENTED
              ? "stats.comments"
              : "stats.retweets";

          // CONDITIONAL UPDATE (IDEMPOTENCY)
          await Tweet.updateOne(
            {
              _id: event.aggregateId,
              processedEvents: { $ne: event._id }, // Chỉ update nếu mảng processedEvents CHƯA CÓ cái event._id này
            },
            {
              $inc: { [incField]: 1 },
              $push: { processedEvents: event._id }, // Thêm vào processedEvents mark đã process
            },
          );

          // await OutboxEvent.findByIdAndDelete(event._id);
          await OutboxEvent.findByIdAndUpdate(
            event._id,
            {
              status: OUTBOX_STATUS_TYPES.DONE,
            },
            { returnDocument: "after" },
          );
          processedCount++;
        } catch (error) {
          logger.error(
            error,
            `❌ Worker ${this.workerId} lỗi event ${event._id.toString()}:`,
          );
          await OutboxEvent.findByIdAndUpdate(event._id, {
            status: OUTBOX_STATUS_TYPES.FAILED,
          });
        }
      }
    } catch (error) {
      logger.error(error, `❌ Lỗi Worker ${this.workerId} khi fetch Outbox:`);
    } finally {
      this.isProcessing = false;
    }
  };

  public init() {
    setInterval(() => void this.process(), envConfig.OUTBOX_WORKER_INTERVAL);
    logger.info(`🚀 Outbox Worker [${this.workerId}] is ready!`);
  }
}
