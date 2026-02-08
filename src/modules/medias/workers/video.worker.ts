import { redisConnection } from "@/common/config/redis";
import logger from "@/common/utils/logger";
import { encodeHLSWithFFmpeg } from "@/common/utils/video";
import type { Job } from "bullmq";
import { Worker } from "bullmq";
import { unlink } from "node:fs/promises";

const processEncodeVideo = async (
  job: Job<{ videoPath: string; fileName: string }>,
) => {
  // TODO: type cho job
  logger.info(job);
  const { videoPath, fileName } = job.data;

  logger.info(`⏳ [Worker] Đang encode HLS (Native FFmpeg): ${fileName}...`);
  logger.info(`   Path: ${videoPath}`);

  try {
    await encodeHLSWithFFmpeg(videoPath, fileName);

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

export const initVideoWorker = () => {
  const worker = new Worker("video-encoding", processEncodeVideo, {
    connection: redisConnection,
    concurrency: 1, // Chỉ xử lý 1 video 1 lần
  });

  worker.on("completed", (job) => {
    logger.info(`🎉 Job ${job.id} hoàn thành!`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`❌ Job ${job?.id} thất bại: ${err.message}`);
  });

  logger.info("🚀 Video Worker is ready!");
};
