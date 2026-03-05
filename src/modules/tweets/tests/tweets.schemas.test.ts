import { describe, expect, it } from "bun:test";
import { TweetReqBody } from "../tweets.schemas";

const basePayload = {
  type: 0,
  audience: 0,
  content: "Test Unit Test cho X-Clone cực khét #buntest @ngoc",
  parentId: null,
};

describe("TweetReqBody Schema Validation", () => {
  it("Must pass when attach only 1 video", () => {
    const payload = {
      ...basePayload,
      medias: [{ url: "http://x-clone.com/vid1.mp4", type: "video" }],
    };

    const result = TweetReqBody.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("Must pass when attach <= 4 image", () => {
    const payload = {
      ...basePayload,
      medias: [
        { url: "http://x-clone.com/img1.jpg", type: "image" },
        { url: "http://x-clone.com/img2.jpg", type: "image" },
      ],
    };

    const result = TweetReqBody.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("Must throw error when attach > 1 Video", () => {
    const payload = {
      ...basePayload,
      medias: [
        { url: "http://x-clone.com/vid1.mp4", type: "video" },
        { url: "http://x-clone.com/vid2.mp4", type: "video" },
      ],
    };

    const result = TweetReqBody.safeParse(payload);

    expect(result.success).toBe(false);

    if (!result.success) {
      const customError = result.error.issues.find(
        (i) => i.message === "Chỉ được phép đính kèm tối đa 1 Video",
      );

      expect(customError).toBeDefined();
    }
  });

  it("Must throw error when > 1 video and > 3 images", () => {
    const payload = {
      ...basePayload,
      medias: [
        { url: "http://x-clone.com/vid1.mp4", type: "video" },
        { url: "http://x-clone.com/img1.jpg", type: "image" },
        { url: "http://x-clone.com/img1.jpg", type: "image" },
        { url: "http://x-clone.com/img1.jpg", type: "image" },
        { url: "http://x-clone.com/img1.jpg", type: "image" },
      ],
    };

    const result = TweetReqBody.safeParse(payload);

    expect(result.success).toBe(false);

    if (!result.success) {
      const customError = result.error.issues.find(
        (i) => i.message === "Chỉ được phép đính kèm tối đa 3 ảnh và 1 video",
      );

      expect(customError).toBeDefined();
    }
  });

  it("Must throw error when Comment (type=2) but missing parentId field", () => {
    const payload = {
      ...basePayload,
      type: 2, // COMMENT
      parentId: null,
    };

    const result = TweetReqBody.safeParse(payload);

    expect(result.success).toBe(false);

    if (!result.success) {
      const customError = result.error.issues.find(
        (i) =>
          i.path.includes("parentId") &&
          i.message === "Phải truyền parentId khi Retweet, Comment hoặc Quote",
      );

      expect(customError).toBeDefined();
    }
  });

  it("Must throw invalid_value when parentId is invalid", () => {
    const payload = {
      ...basePayload,
      parentId: "123_abc_linh_tinh",
    };

    const result = TweetReqBody.safeParse(payload);

    expect(result.success).toBe(false);

    if (!result.success) {
      const customError = result.error.issues.find(
        (i) =>
          i.path.includes("parentId") && i.message === "parentId không hợp lệ",
      );

      expect(customError).toBeDefined();
    }
  });

  it("Must thow invalid_value when type and audience is invalid", () => {
    const payload = {
      ...basePayload,
      type: 99,
      audience: 89,
    };

    const result = TweetReqBody.safeParse(payload);

    expect(result.success).toBe(false);

    if (!result.success) {
      const invalidValue = result.error.issues.find(
        (i) =>
          (i.path.includes("type") && i.message === "type không hợp lệ") ||
          (i.path.includes("audience") &&
            i.message === "audience không hợp lệ"),
      );

      expect(invalidValue).toBeDefined();
    }
  });

  it("Must throw invalid_format when url media is invalid", () => {
    const payload = {
      ...basePayload,
      medias: [{ url: "not-a-link", type: "image" }],
    };

    const result = TweetReqBody.safeParse(payload);

    expect(result.success).toBe(false);

    if (!result.success) {
      const invalidFormat = result.error.issues.find(
        (i) =>
          i.path.includes("url") &&
          i.message === "Đường dẫn không đúng định dạng",
      );

      expect(invalidFormat).toBeDefined();
    }
  });
});
