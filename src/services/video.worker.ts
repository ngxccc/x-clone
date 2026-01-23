import { redisConnection } from "@/config/redis.js";
import { encodeHLSWithFFmpeg } from "@/utils/video.js";
import { Job, Worker } from "bullmq";
import { unlink } from "node:fs/promises";

const processEncodeVideo = async (job: Job) => {
  const { videoPath, fileName } = job.data;

  console.log(`⏳ [Worker] Đang encode HLS (Native FFmpeg): ${fileName}...`);
  console.log(`   Path: ${videoPath}`);

  try {
    await encodeHLSWithFFmpeg(videoPath, fileName);

    const idName = fileName.split(".")[0];

    // NOTE: Trả về link S3 nếu deloy lên S3
    const hlsUrl = `http://localhost:4000/static/video/${idName}/master.m3u8`;

    await unlink(videoPath).catch((e) => console.log("Lỗi xóa file gốc:", e));

    console.log(`✅ [Worker] Done job ${job.id}`);
    return { status: "success", hlsUrl };
  } catch (error) {
    console.error("❌ Worker Error:", error);
    throw error;
  }
};

export const initVideoWorker = () => {
  const worker = new Worker("video-encoding", processEncodeVideo, {
    connection: redisConnection,
    concurrency: 1, // Chỉ xử lý 1 video 1 lần
  });

  worker.on("completed", (job) => {
    console.log(`🎉 Job ${job.id} hoàn thành!`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} thất bại: ${err.message}`);
  });

  console.log("🚀 Video Worker is ready!");
};
