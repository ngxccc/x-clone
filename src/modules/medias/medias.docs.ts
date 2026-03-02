import { registerRoute } from "@/common/config/openapi";
import {
  UploadImageReqBody,
  UploadImageResData,
  UploadVideoReqBody,
  UploadVideoResData,
} from "./medias.schemas";
import { BuildSuccessRes } from "@/common/schemas/common.schemas";

export const registerMediasDocs = () => {
  // Upload tweet image
  registerRoute({
    method: "post",
    path: "/api/v1/medias/upload-tweet-image",
    tags: ["Medias"],
    summary: "Tải lên ảnh tweet",
    isPublic: false,
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: UploadImageReqBody,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Tải ảnh lên thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(
              UploadImageResData,
              "Tải ảnh lên thành công",
            ),
          },
        },
      },
    },
  });

  // Upload Avatar
  registerRoute({
    method: "post",
    path: "/api/v1/medias/upload-avatar",
    tags: ["Medias"],
    summary: "Tải lên ảnh đại diện",
    isPublic: false,
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: UploadImageReqBody },
        },
      },
    },
    responses: {
      200: {
        description: "Tải ảnh đại diện thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(
              UploadImageResData,
              "Tải ảnh lên thành công",
            ),
          },
        },
      },
    },
  });

  // Upload Cover
  registerRoute({
    method: "post",
    path: "/api/v1/medias/upload-cover",
    tags: ["Medias"],
    summary: "Tải lên ảnh bìa",
    isPublic: false,
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: UploadImageReqBody },
        },
      },
    },
    responses: {
      200: {
        description: "Tải ảnh bìa thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(
              UploadImageResData,
              "Tải ảnh lên thành công",
            ),
          },
        },
      },
    },
  });

  // Upload Video
  registerRoute({
    method: "post",
    path: "/api/v1/medias/upload-video",
    tags: ["Medias"],
    summary: "Tải lên Video",
    isPublic: false,
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: UploadVideoReqBody },
        },
      },
    },
    responses: {
      200: {
        description: "Tải video lên thành công (Đang chờ xử lý HLS)",
        content: {
          "application/json": {
            schema: BuildSuccessRes(
              UploadVideoResData,
              "Tải video lên thành công",
            ),
          },
        },
      },
    },
  });
};
