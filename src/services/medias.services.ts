import { isProduction } from "@/constants/config.js";
import { UPLOAD_IMAGE_DIR } from "@/constants/dir.js";
import { handleUploadImage } from "@/utils/file.js";
import { Request } from "express";
import { unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split(".");
  namearr.pop();
  return namearr.join("");
};

class MediasService {
  // TODO: Upload lên Cloud Storage bên thứ 3
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req);

    const result = await Promise.all([
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename);
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`);

        try {
          // Check Magic Bytes
          await sharp(file.filepath).jpeg().toFile(newPath);
          await unlink(file.filepath);

          return {
            url: isProduction()
              ? `${process.env.HOST}/static/image/${newName}.jpg`
              : `http://localhost:4000/static/image/${newName}.jpg`,
            type: 0, // Image type
          };
        } catch (error) {
          await unlink(file.filepath).catch(() => {});
          throw error;
        }
      }),
    ]);

    return result;
  }
}

const mediasService = new MediasService();
export default mediasService;
