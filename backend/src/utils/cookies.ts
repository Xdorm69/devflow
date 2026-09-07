import { CookieOptions, Response } from "express";
import config, { isProduction } from "../configs/config.ts";

export const REFRESH_COOKIE_NAME = "refreshToken";

// Scoped to the auth routes only, so the cookie is never sent to unrelated
// endpoints. Must match between setting and clearing the cookie.
const REFRESH_COOKIE_PATH = "/api/v1/auth";

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    // "lax" is enough since the refresh token is never read by client JS or
    // sent cross-site by a plain link; "strict" would break refresh-on-load
    // after following an external link into the app.
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    domain: config.COOKIE_DOMAIN,
  };
}

export function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions(),
    maxAge: config.REFRESH_COOKIE_MAX_AGE_MS,
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions());
}
