import { spawn } from "child_process";
import fs from "fs";
import { UPLOAD_VIDEO_DIR } from "@/constants/dir.js";
import { resolve } from "path";

/**
 * Chạy lệnh FFmpeg trực tiếp
 * @param inputPath Đường dẫn video đầu vào
 * @param originalName Tên file gốc
 */
export const encodeHLSWithFFmpeg = async (
  inputPath: string,
  originalName: string,
) => {
  const idName = originalName.split(".")[0];
  if (!idName) {
    throw new Error("Invalid original name: cannot extract id");
  }

  const outputDir = resolve(UPLOAD_VIDEO_DIR, idName);

  // Tạo folder chứa HLS
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = resolve(outputDir, "master.m3u8");

  // Xây dựng mảng arguments cho FFmpeg
  // Tương đương lệnh: ffmpeg -y -i input.mp4 -c:v libx264 -c:a aac ... output.m3u8
  const args = [
    "-y", // Ghi đè file nếu đã tồn tại
    "-i",
    inputPath, // Input
    "-map",
    "0", // Map tất cả stream (video, audio)

    // --- VIDEO OPTIONS ---
    "-c:v",
    "libx264", // Codec video H.264
    "-vf",
    "scale=-2:1080", // Resize về FHD 1080p và tự động tính chiều ngang
    "-crf",
    "23", // Chất lượng (0-51), 23 là mức cân bằng chuẩn
    "-preset",
    "veryfast", // Tốc độ nén (ultrafast, superfast, veryfast, faster, fast, medium...)
    "-g",
    "48", // Keyframe interval (quan trọng cho HLS), nên set bằng fps * 2

    // --- AUDIO OPTIONS ---
    "-c:a",
    "aac", // Codec audio AAC
    "-ar",
    "44100", // Audio sample rate
    "-b:a",
    "128k", // Audio bitrate

    // --- HLS OPTIONS ---
    "-f",
    "hls", // Format output là HLS
    "-hls_time",
    "6", // Độ dài mỗi segment (giây). 6s là chuẩn Apple recommend
    "-hls_list_size",
    "0", // Lưu full playlist (không xóa segment cũ)
    "-hls_segment_filename",
    resolve(outputDir, "v%v_segment%03d.ts"), // Template tên file segment

    // --- OUTPUT ---
    outputPath,
  ];

  console.log(`🎥 Start FFmpeg with args: ${args.join(" ")}`);

  return new Promise<string>((resolve, reject) => {
    // Spawn tiến trình con
    const ffmpegProcess = spawn("ffmpeg", args);

    // FFmpeg ghi log vào stderr
    ffmpegProcess.stderr.on("data", (_data) => {
      // console.log(`ffmpeg progress: ${_data}`);
    });

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ FFmpeg convert done!");
        resolve(outputPath);
      } else {
        console.error(`❌ FFmpeg exited with code ${code}`);
        reject(new Error(`FFmpeg error code ${code}`));
      }
    });

    // Xử lý lỗi khi không gọi được lệnh ffmpeg
    ffmpegProcess.on("error", (err) => {
      console.error("❌ Failed to start FFmpeg process:", err);
      reject(err);
    });
  });
};
