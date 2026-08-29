import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.ts";
import { verifyAccessToken } from "../utils/jwt.ts";

/**
 * Requires a valid `Authorization: Bearer <accessToken>` header.
 * On success, attaches `{ id, tokenVersion }` to `req.user`.
 */
const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, tokenVersion: payload.tokenVersion };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, "Access token expired"));
      return;
    }
    next(new ApiError(401, "Invalid access token"));
  }
};

export default authenticate;
