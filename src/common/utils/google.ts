import { GOOGLE_APIS } from "@/common/constants/googleApi.js";
import "dotenv/config";
import { BadRequestError } from "./errors.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import type {
  GoogleTokenResponse,
  GoogleUserInfo,
} from "@/common/types/common.types.js";
import envConfig from "@/common/config/env.js";

export class GoogleService {
  async getToken(code: string) {
    const body = {
      code,
      client_id: envConfig.GOOGLE_CLIENT_ID,
      client_secret: envConfig.GOOGLE_CLIENT_SECRET,
      redirect_uri: envConfig.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    };

    const response = await fetch(GOOGLE_APIS.TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body),
    });

    // eslint-disable-next-line
    const data = (await response.json()) as any;

    if (!response.ok)
      // eslint-disable-next-line
      throw new BadRequestError(USERS_MESSAGES.GOOGLE_AUTH_FAILED, data.error);

    return data as GoogleTokenResponse;
  }

  async getUserInfo(access_token: string) {
    const response = await fetch(`${GOOGLE_APIS.USER_INFO}?alt=json`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok)
      throw new BadRequestError(USERS_MESSAGES.GOOGLE_GET_USER_INFO_FAILED);

    return (await response.json()) as GoogleUserInfo;
  }
}
