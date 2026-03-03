import { registerRoute } from "@/common/config/openapi";
import { TweetData, TweetReqBody } from "./tweets.schemas";
import { BuildSuccessRes } from "@/common/schemas/common.schemas";

export const registerTweetsDocs = () => {
  // Tweet
  registerRoute({
    method: "post",
    path: "/api/v1/tweets",
    tags: ["Tweets"],
    summary: "Tạo tweet mới",
    isPublic: false,
    request: {
      body: {
        content: {
          "application/json": {
            schema: TweetReqBody,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Tạo bài viết thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(TweetData, "Tạo bài viết thành công"),
          },
        },
      },
    },
  });
};
