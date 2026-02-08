import { type Request } from "express";

interface TokenCookies {
  refresh_token: string;
}

export interface RefreshTokenRequest extends Request {
  cookies: TokenCookies;
}
