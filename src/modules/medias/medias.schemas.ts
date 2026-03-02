import { z } from "zod";

export const UploadImageReqBody = z.object({
  image: z.array(z.string()).openapi({
    type: "array",
    items: {
      type: "string",
      format: "binary",
    },
    description: "Mảng file ảnh (Tối đa 4 file, chuẩn JPEG/PNG, max 10MB/file)",
  }),
});

export const UploadImageResData = z
  .array(
    z.object({
      url: z.string().openapi({
        example: "http://localhost:4000/static/image/1715403921.jpg",
      }),
      type: z.number().openapi({
        example: 0,
        description: "0: Image, 1: Video",
      }),
    }),
  )
  .openapi("UploadImageResult");

export const UploadVideoReqBody = z.object({
  video: z.array(z.string()).openapi({
    type: "array",
    items: {
      type: "string",
      format: "binary",
    },
    description: "File video (Tối đa 1 file, chuẩn MP4/MOV, max 50MB)",
  }),
});

export const UploadVideoResData = z
  .array(
    z.object({
      url: z.string().openapi({
        example: "http://localhost:4000/static/video/1715403921.mp4",
      }),
      type: z.number().openapi({
        example: 1,
        description: "0: Image, 1: Video",
      }),
      status: z.string().openapi({
        example: "pending",
        description:
          "Trạng thái xử lý video (pending, processing, success, failed)",
      }),
    }),
  )
  .openapi("UploadVideoResult");
