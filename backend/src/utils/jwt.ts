import jwt from "jsonwebtoken";
import config from "../configs/config.ts";

export interface TokenPayload {
  sub: string; // user id
  tokenVersion: number;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
}
