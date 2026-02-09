import { redisConnection } from "@/common/config/redis";
import logger from "@/common/utils/logger";
import { type VideoService } from "@/common/utils/video";
import type { Job } from "bullmq";
import { Worker } from "bullmq";
import { unlink } from "node:fs/promises";

export class VideoWorker {
  private worker: Worker | undefined;
  private readonly queueName = "video-encoding";

  public constructor(private readonly videoService: VideoService) {}

  private process = async (
    job: Job<{ videoPath: string; fileName: string }>,
  ) => {
    // TODO: type cho job
    const { videoPath, fileName } = job.data;
    logger.info(job);

    logger.info(`⏳ [Worker] Đang encode HLS (Native FFmpeg): ${fileName}...`);
    logger.info(`   Path: ${videoPath}`);

    try {
      await this.videoService.encodeHLS(videoPath, fileName);

      const idName = fileName.split(".")[0];

      // NOTE: Trả về link S3 nếu deloy lên S3
      const hlsUrl = `http://localhost:4000/static/video/${idName}/master.m3u8`;

      await unlink(videoPath).catch((e) => logger.info(e, "Lỗi xóa file gốc:"));

      logger.info(`✅ [Worker] Done job ${job.id}`);
      return { status: "success", hlsUrl };
    } catch (error) {
      logger.error(error, "❌ Worker Error:");
      throw error;
    }
  };

  public init() {
    if (this.worker) return;

    this.worker = new Worker(this.queueName, this.process, {
      connection: redisConnection,
      concurrency: 1, // Chỉ xử lý 1 video 1 lần
    });

    this.setupEvents();
    logger.info(`🚀 Video Worker [${this.queueName}] is ready!`);
  }

  private setupEvents() {
    this.worker?.on("completed", (job) => {
      logger.info(`🎉 Job ${job.id} hoàn thành!`);
      // Sau này có thể gọi this.notificationService.send(...)
    });

    this.worker?.on("failed", (job, err) => {
      logger.error(`❌ Job ${job?.id} thất bại: ${err.message}`);
    });
  }

  public async close() {
    await this.worker?.close();
  }
}
