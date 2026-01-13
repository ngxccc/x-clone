import { UPLOAD_TEMP_DIR } from "@/constants/dir.js";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
import { Request } from "express";
import formidable, { File } from "formidable";
import { existsSync, mkdirSync } from "node:fs";
import { PayloadTooLargeError, UnprocessableEntityError } from "./errors.js";
import { UPLOAD_CONFIG } from "@/constants/config.js";
// import { errors as formidableErrors } from "formidable";

export const initFolder = () => {
  if (!existsSync(UPLOAD_TEMP_DIR)) {
    mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true,
    });
  }
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
          new UnprocessableEntityError(USERS_MESSAGES.IMAGE_FILE_TYPE_INVALID),
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
