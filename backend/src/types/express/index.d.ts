import "express";
import type { WorkspaceMember } from "../../generated/prisma/client.ts";

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

      /**
       * Populated by the `requireWorkspaceRole` middleware. Lets downstream
       * handlers reuse the membership row instead of re-querying it.
       */
      workspaceMembership?: WorkspaceMember;
    }
  }
}

export {};
