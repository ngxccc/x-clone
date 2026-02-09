import { redisConnection } from "@/common/config/redis.js";
import { Queue } from "bullmq";

export class QueueService {
  private videoQueue: Queue;

  constructor() {
    this.videoQueue = new Queue("video-encoding", {
      connection: redisConnection,
    });
  }

  async addVideoToQueue(payload: { videoPath: string; fileName: string }) {
    await this.videoQueue.add("encode-video", payload, {
      removeOnComplete: true, // Xoá job khỏi Redis khi thành công
      removeOnFail: false, // Giữ lại để debug khi lỗi
    });
  }

  async close() {
    await this.videoQueue.close();
  }
}
