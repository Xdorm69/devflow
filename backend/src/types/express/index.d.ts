import "express";

declare global {
  namespace Express {
    interface Request {
      /**
       * Populated by the `authenticate` middleware after verifying the
       * access token. Only present on routes that use that middleware.
       */
      user?: {
        id: string;
        tokenVersion: number;
      };
    }
  }
}

export {};
