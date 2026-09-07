import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import ApiError from "../utils/apiError.ts";

type RequestPart = "body" | "query" | "params";

/**
 * Validates `req[part]` against `schema`. On success, `req[part]` is replaced
 * with the parsed (and possibly transformed/defaulted) value, so downstream
 * handlers can trust its shape. On failure, forwards a 400 ApiError with a
 * field-by-field breakdown instead of letting the raw ZodError leak out.
 */
const validate = (schema: ZodType, part: RequestPart = "body") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[part]);
      req[part] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        next(new ApiError(400, "Validation failed", errors));
        return;
      }
      next(err);
    }
  };
};

export default validate;
