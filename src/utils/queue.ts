import { redisConnection } from "@/config/redis.js";
import { Queue } from "bullmq";

export const videoEncodingQuere = new Queue("video-encoding", {
  connection: redisConnection,
});

export const addVideoToQueue = async (payload: {
  videoPath: string;
  fileName: string;
}) => {
  await videoEncodingQuere.add("encode-video", payload, {
    removeOnComplete: true, // Xoá job khỏi Redis khi thành công
    removeOnFail: false, // Giữ lại để debug khi lỗi
  });
};
