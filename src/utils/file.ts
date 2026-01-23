import {
  UPLOAD_IMAGE_DIR,
  UPLOAD_TEMP_DIR,
  UPLOAD_VIDEO_DIR,
} from "@/constants/dir.js";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
import { Request } from "express";
import formidable, { File } from "formidable";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { PayloadTooLargeError, UnprocessableEntityError } from "./errors.js";
import { UPLOAD_CONFIG } from "@/constants/config.js";
import { fileTypeFromFile } from "file-type";
// import { errors as formidableErrors } from "formidable";

export const initFolder = () => {
  const uploadsFolder = [UPLOAD_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR];

  uploadsFolder.forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, {
        recursive: true, // Tạo cả folder cha nếu chưa có
      });
    }
  });
};

export const handleUploadImage = async (req: Request) => {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (form as any).emit(
          "error",
          new UnprocessableEntityError(USERS_MESSAGES.FILE_TYPE_INVALID),
        );
      }

      return valid;
    },
  });

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) {
        if (err.code === ERROR_CODES.FORMIDABLE_MAX_FILE_SIZE)
          return reject(
            new UnprocessableEntityError(
              USERS_MESSAGES.IMAGE_FILE_SIZE_LIMIT_EXCEEDED,
            ),
          );

        if (err.code === ERROR_CODES.FORMIDABLE_MAX_FILES)
          return reject(
            new PayloadTooLargeError(
              USERS_MESSAGES.IMAGE_FILE_COUNT_LIMIT_EXCEEDED,
            ),
          );

        if (err.code === ERROR_CODES.FORMIDABLE_MAX_TOTAL_FILE_SIZE)
          return reject(
            new PayloadTooLargeError(
              USERS_MESSAGES.IMAGE_TOTAL_FILE_SIZE_LIMIT_EXCEEDED,
            ),
          );

        return reject(err);
      }

      // key trong Form Data phải là image
      if (!files.image)
        return reject(
          new UnprocessableEntityError(USERS_MESSAGES.IMAGE_FILE_IS_REQUIRED),
        );

      const images = files.image;

      resolve(images);
    });
  });
};

export const handleUploadVideo = async (req: Request) => {
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
        Boolean(mimetype?.includes("mp4") || mimetype?.includes("quicktime"));

      if (!valid) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (form as any).emit(
          "error",
          new UnprocessableEntityError(USERS_MESSAGES.FILE_TYPE_INVALID),
        );
      }

      return valid;
    },
  });

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, async (err, _fields, files) => {
      if (err) {
        if (err.code === ERROR_CODES.FORMIDABLE_MAX_FILE_SIZE)
          return reject(
            new UnprocessableEntityError(
              USERS_MESSAGES.VIDEO_FILE_SIZE_LIMIT_EXCEEDED,
            ),
          );

        if (err.code === ERROR_CODES.FORMIDABLE_MAX_FILES)
          return reject(
            new PayloadTooLargeError(
              USERS_MESSAGES.VIDEO_FILE_COUNT_LIMIT_EXCEEDED,
            ),
          );

        if (err.code === ERROR_CODES.FORMIDABLE_MAX_TOTAL_FILE_SIZE)
          return reject(
            new PayloadTooLargeError(
              USERS_MESSAGES.VIDEO_TOTAL_FILE_SIZE_LIMIT_EXCEEDED,
            ),
          );

        return reject(err);
      }

      // key trong Form Data phải là image
      if (!files.video)
        return reject(
          new UnprocessableEntityError(USERS_MESSAGES.VIDEO_FILE_IS_REQUIRED),
        );

      const videos = files.video;

      // Magic bytes check
      for (const video of videos) {
        try {
          const type = await fileTypeFromFile(video.filepath);

          const isValid =
            type &&
            (type.mime === "video/mp4" || type.mime === "video/quicktime");
          if (!isValid) {
            try {
              unlinkSync(video.filepath);
            } catch (cleanupError) {
              console.error("Cleanup failed", cleanupError);
            }

            return reject(
              new UnprocessableEntityError(
                USERS_MESSAGES.VIDEO_EXTENSION_MISMATCH,
              ),
            );
          }
        } catch (error) {
          return reject(error);
        }
      }

      resolve(videos);
    });
  });
};
