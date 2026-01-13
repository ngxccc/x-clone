import { handleUploadImage } from "@/utils/file.js";
import { Request } from "express";

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req);

    const result = files.map((file) => {
      return {
        url: `http://localhost:4000/static/image/${file.newFilename}`,
        type: 0, // Image type
      };
    });

    return result;
  }
}

const mediasService = new MediasService();
export default mediasService;
