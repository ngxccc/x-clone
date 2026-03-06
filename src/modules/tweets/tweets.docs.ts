import { registerRoute } from "@/common/config/openapi";
import { TweetData, TweetReqBody } from "./tweets.schemas";
import { BuildSuccessRes } from "@/common/schemas/common.schemas";

export const registerTweetsDocs = () => {
  const TweetRequestSchema = TweetReqBody.openapi("TweetRequest");
  const TweetResponseSchema = TweetData.openapi("TweetResponseData");

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
            schema: TweetRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Tạo bài viết thành công",
        content: {
          "application/json": {
            schema: BuildSuccessRes(TweetResponseSchema),
          },
        },
      },
    },
  });
};
