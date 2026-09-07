import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

interface WebError extends Error {
  statusCode?: number;
  errors?: any[];
}

const errorHandler = (
  err: WebError | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  let formattedError: ApiError;

  if (err instanceof ApiError) {
    formattedError = err;
  } else {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong on the server";

    formattedError = new ApiError(
      statusCode,
      message,
      err.errors || [],
      err.stack,
    );
  }

  const response = {
    success: formattedError.success,
    message: formattedError.message,
    errors: formattedError.errors || [],
    ...(process.env.NODE_ENV === "development" && {
      stack: formattedError.stack,
    }),
  };

  return res.status(formattedError.statusCode).json(response);
};

export default errorHandler;
