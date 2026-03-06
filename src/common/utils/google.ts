import { GOOGLE_APIS } from "@/common/constants/googleApi.js";
import "dotenv/config";
import { BadRequestError, InternalServerError } from "./errors.js";
import type {
  GoogleTokenResponse,
  GoogleUserInfo,
} from "@/common/types/common.types.js";
import envConfig from "@/common/config/env.js";
import { ERROR_CODES } from "../constants/error-codes.js";

export class GoogleService {
  public async getToken(code: string) {
    const body = {
      code,
      client_id: envConfig.GOOGLE_CLIENT_ID,
      client_secret: envConfig.GOOGLE_CLIENT_SECRET,
      redirect_uri: envConfig.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    };

    try {
      const response = await fetch(GOOGLE_APIS.TOKEN, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(body),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        throw new BadRequestError({
          code: ERROR_CODES.THIRD_PARTY.GOOGLE_AUTH_FAILED,
          details: data as Record<string, unknown>,
        });
      }

      return data as GoogleTokenResponse;
    } catch (error) {
      if (error instanceof BadRequestError) throw error;

      throw new InternalServerError({
        code: ERROR_CODES.THIRD_PARTY.NETWORK_ERROR,
        details: {
          reason:
            error instanceof Error
              ? error.message
              : "Failed to fetch Google Token",
        },
      });
    }
  }

  public async getUserInfo(access_token: string) {
    try {
      const response = await fetch(`${GOOGLE_APIS.USER_INFO}?alt=json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        throw new BadRequestError({
          code: ERROR_CODES.THIRD_PARTY.GOOGLE_USER_INFO_FAILED,
          details: data as Record<string, unknown>,
        });
      }

      return data as GoogleUserInfo;
    } catch (error) {
      if (error instanceof BadRequestError) throw error;

      throw new InternalServerError({
        code: ERROR_CODES.THIRD_PARTY.NETWORK_ERROR,
        details: {
          reason:
            error instanceof Error
              ? error.message
              : "Failed to fetch Google User Info",
        },
      });
    }
  }
}
