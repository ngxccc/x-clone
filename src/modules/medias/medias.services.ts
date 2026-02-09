import envConfig, { isProduction } from "@/common/config/env.js";
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from "@/common/constants/dir.js";
import type { UploadPurposeType } from "@/common/constants/enums.js";
import {
  MEDIA_TYPES,
  UPLOAD_PURPOSE,
  VIDEO_STATUS,
} from "@/common/constants/enums.js";
import type { FileService } from "@/common/utils/file";
import type { QueueService } from "@/common/utils/queue";
import type { Request } from "express";
import { rename } from "node:fs/promises";
import { unlink } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split(".");
  namearr.pop();
  return namearr.join("");
};

export class MediaService {
  constructor(
    private readonly fileService: FileService,
    private readonly queueService: QueueService,
  ) {}

  // TODO: Upload lên Cloud Storage bên thứ 3
  async uploadImage(req: Request, type: UploadPurposeType) {
    const files = await this.fileService.handleUploadImage(req);

    // FIX LỖI EPERM: Ngăn sharp không giữ file mở khiến bị lock
    sharp.cache(false);

    const result = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename);
        const newPath = resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`);

        try {
          // Check Magic Bytes
          const sharpInstance = sharp(file.filepath);
          if (type === UPLOAD_PURPOSE.AVATAR)
            sharpInstance.resize(500, 500, {
              fit: "cover",
              position: "center",
            });

          await sharpInstance.jpeg({ quality: 80 }).toFile(newPath);

          await unlink(file.filepath);

          return {
            url: isProduction
              ? `${envConfig.HOST}/static/image/${newName}.jpg`
              : `http://localhost:4000/static/image/${newName}.jpg`,
            type: MEDIA_TYPES.IMAGE,
          };
        } catch (error) {
          await unlink(file.filepath).catch(() => {
            /* empty */
          });
          throw error;
        }
      }),
    );

    return result;
  }

  async uploadVideo(req: Request) {
    const files = await this.fileService.handleUploadVideo(req);

    const result = await Promise.all(
      files.map(async (file) => {
        const newPath = resolve(UPLOAD_VIDEO_DIR, file.newFilename);

        await rename(file.filepath, newPath);

        await this.queueService.addVideoToQueue({
          videoPath: newPath,
          fileName: file.newFilename,
        });

        // TODO: Triển khai Socket IO đến thống báo user biết trạng thái
        return {
          url: isProduction
            ? `${envConfig.HOST}/static/video/${file.newFilename}`
            : `http://localhost:4000/static/video/${file.newFilename}`,
          type: MEDIA_TYPES.VIDEO,
          status: VIDEO_STATUS.PENDING,
        };
      }),
    );

    return result;
  }
}
