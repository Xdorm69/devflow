import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/apiError.ts";
import { getWorkspaceMembership } from "../../utils/cached/workspace.ts";
import { WorkspaceRole } from "../../generated/prisma/enums.ts";

export function requireWorkspaceRole(allowedRoles: WorkspaceRole[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {workspaceId} = req.params;
            const userId = req.user?.id;

            if (!userId) return next(new ApiError(401, "User id is missing from request"));
            
            const membership = await getWorkspaceMembership(workspaceId as string, userId);

            if (!membership) {
                next(new ApiError(403, "User is not a member of the workspace"));
                return;
            }
            
            if (!allowedRoles.includes(membership.role)) {
                next(new ApiError(403, "User does not have the required role"));
                return;
            }
            
            next();
        } catch (error) {
            next(new ApiError(500, "Internal server error"));
        }
    }
}

