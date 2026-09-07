import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/apiError.ts";
import { getWorkspaceMembership } from "../../utils/cached/workspace.ts";
import { WorkspaceRole } from "../../generated/prisma/enums.ts";

/**
 * @param allowedRoles Roles permitted to proceed. Pass all three
 *   (MEMBER/ADMIN/OWNER) to simply require "is a member of the workspace".
 * @param paramName Name of the route param holding the workspace id.
 *   Defaults to "workspaceId" (used by all workspace-nested resource
 *   routes). The top-level workspace router uses "id" instead, since its
 *   own resource *is* the workspace.
 */
export function requireWorkspaceRole(
    allowedRoles: WorkspaceRole[],
    paramName: string = "workspaceId",
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const workspaceId = req.params[paramName] as string | undefined;
            const userId = req.user?.id;

            if (!userId) return next(new ApiError(401, "User id is missing from request"));
            if (!workspaceId) return next(new ApiError(400, `Missing '${paramName}' route param`));

            const membership = await getWorkspaceMembership(workspaceId, userId);

            if (!membership) {
                next(new ApiError(403, "User is not a member of the workspace"));
                return;
            }
            
            if (!allowedRoles.includes(membership.role)) {
                next(new ApiError(403, "User does not have the required role"));
                return;
            }

            // Downstream handlers can reuse this instead of re-querying.
            req.workspaceMembership = membership;
            next();
        } catch (error) {
            next(new ApiError(500, "Internal server error"));
        }
    }
}

