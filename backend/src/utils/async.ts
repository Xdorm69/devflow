
import { Request, Response, NextFunction } from 'express';

const asyncHandler = (requestHandler: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // Passes errors directly to Express error middleware
  };
};

export default asyncHandler;
