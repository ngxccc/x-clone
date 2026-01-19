import envConfig, { isProduction } from "@/constants/config.js";
import { UPLOAD_IMAGE_DIR } from "@/constants/dir.js";
import {
  MEDIA_TYPES,
  UPLOAD_PURPOSE,
  UploadPurposeType,
} from "@/constants/enums.js";
import { handleUploadImage } from "@/utils/file.js";
import { Request } from "express";
import { unlink } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split(".");
  namearr.pop();
  return namearr.join("");
};

class MediasService {
  // TODO: Upload lên Cloud Storage bên thứ 3
  async uploadImage(req: Request, type: UploadPurposeType) {
    const files = await handleUploadImage(req);

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
            url: isProduction()
              ? `${envConfig.HOST}/static/image/${newName}.jpg`
              : `http://localhost:4000/static/image/${newName}.jpg`,
            type: MEDIA_TYPES.IMAGE,
          };
        } catch (error) {
          await unlink(file.filepath).catch(() => {});
          throw error;
        }
      }),
    );

    return result;
  }
}

const mediasService = new MediasService();
export default mediasService;
