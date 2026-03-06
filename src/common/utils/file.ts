import {
  UPLOAD_IMAGE_DIR,
  UPLOAD_TEMP_DIR,
  UPLOAD_VIDEO_DIR,
} from "@/common/constants/dir.js";
import type { Request } from "express";
import formidable from "formidable";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import {
  ErrorWithStatus,
  InternalServerError,
  PayloadTooLargeError,
  UnprocessableEntityError,
} from "./errors.js";
import { UPLOAD_CONFIG } from "@/common/config/env.js";
import { fileTypeFromFile } from "file-type";
import type { EventEmitter } from "node:events";
import { ERROR_CODES } from "../constants/error-codes.js";
// import { errors as formidableErrors } from "formidable";

const handleFormidableError = (err: unknown) => {
  const e = err as { code: number; message: string };

  if (e.code === ERROR_CODES.FORMIDABLE.MAX_TOTAL_FILE_SIZE) {
    return new PayloadTooLargeError({
      code: ERROR_CODES.UPLOAD.TOTAL_SIZE_EXCEEDED,
    });
  }
  if (e.code === formidable.errors.biggerThanMaxFileSize) {
    return new PayloadTooLargeError({
      code: ERROR_CODES.UPLOAD.FILE_SIZE_EXCEEDED,
    });
  }
  if (e.code === ERROR_CODES.FORMIDABLE.MAX_FILES) {
    return new PayloadTooLargeError({
      code: ERROR_CODES.UPLOAD.MAX_FILES_EXCEEDED,
    });
  }
  if (e.message === ERROR_CODES.UPLOAD.INVALID_FILE_TYPE) {
    return new UnprocessableEntityError({
      code: ERROR_CODES.UPLOAD.INVALID_FILE_TYPE,
    });
  }
  if (e.code === ERROR_CODES.FORMIDABLE.MAX_FILE_SIZE) {
    return new PayloadTooLargeError({
      code: ERROR_CODES.UPLOAD.MAX_FILES_SIZE_EXCEEDED,
    });
  }
  return new InternalServerError({
    code: ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
    details: e,
  });
};

export class FileService {
  public initFolder() {
    const uploadsFolder = [UPLOAD_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR];

    uploadsFolder.forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, {
          recursive: true, // Tạo cả folder cha nếu chưa có
        });
      }
    });
  }

  public async handleUploadImage(req: Request) {
    const form = formidable({
      uploadDir: UPLOAD_TEMP_DIR,
      maxFiles: UPLOAD_CONFIG.IMAGE_MAX_FILES,
      keepExtensions: true,
      maxFileSize: UPLOAD_CONFIG.IMAGE_MAX_SIZE,
      maxTotalFileSize:
        UPLOAD_CONFIG.IMAGE_MAX_SIZE * UPLOAD_CONFIG.IMAGE_MAX_FILES,

      // validate để chỉ nhận image
      filter: ({ name, mimetype }) => {
        const valid = name == "image" && Boolean(mimetype?.includes("image/"));

        if (!valid) {
          /**
           * ép thành EventEmitter vì type mặc định của formidable
           * không eventName là error
           */
          (form as EventEmitter).emit(
            "error",
            new Error(ERROR_CODES.UPLOAD.INVALID_FILE_TYPE),
          );
        }

        return valid;
      },
    });

    try {
      const [_, files] = await form.parse(req);

      if (!files.image || files.image.length === 0) {
        throw new UnprocessableEntityError({
          code: ERROR_CODES.UPLOAD.MISSING_IMAGE_KEY,
        });
      }

      return files.image;
    } catch (error) {
      throw handleFormidableError(error);
    }
  }

  public async handleUploadVideo(req: Request) {
    const form = formidable({
      uploadDir: UPLOAD_TEMP_DIR,
      maxFiles: UPLOAD_CONFIG.VIDEO_MAX_FILES,
      keepExtensions: true,
      maxFileSize: UPLOAD_CONFIG.VIDEO_MAX_SIZE,
      maxTotalFileSize:
        UPLOAD_CONFIG.VIDEO_MAX_SIZE * UPLOAD_CONFIG.VIDEO_MAX_FILES,

      filter: ({ name, mimetype }) => {
        const valid =
          name == "video" &&
          Boolean(mimetype?.includes("mp4") ?? mimetype?.includes("quicktime"));

        if (!valid) {
          (form as EventEmitter).emit(
            "error",
            new Error(ERROR_CODES.UPLOAD.INVALID_FILE_TYPE),
          );
        }

        return valid;
      },
    });

    try {
      const [_, files] = await form.parse(req);

      if (!files.video || files.video.length === 0) {
        throw new UnprocessableEntityError({
          code: ERROR_CODES.UPLOAD.MISSING_VIDEO_KEY,
        });
      }

      const videos = files.video;

      await Promise.all(
        videos.map(async (video) => {
          const type = await fileTypeFromFile(video.filepath);
          const isValid =
            type &&
            (type.mime === "video/mp4" || type.mime === "video/quicktime");

          if (!isValid) {
            try {
              unlinkSync(video.filepath);
            } catch (e) {
              console.error("Cleanup failed", e);
            }
            throw new UnprocessableEntityError({
              code: ERROR_CODES.UPLOAD.EXTENSION_MISMATCH,
            });
          }
        }),
      );

      return videos;
    } catch (error) {
      if (error instanceof ErrorWithStatus) throw error;
      throw handleFormidableError(error);
    }
  }
}
