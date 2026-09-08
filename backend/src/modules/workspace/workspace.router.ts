import express from "express";
import asyncHandler from "../../utils/async.ts";
import { WorkspaceController } from "./workspace.controller.ts";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "./workspace.validator.ts";
import validate from "../../middlewares/validate.ts";
import { requireWorkspaceRole } from "../../middlewares/workspace/requireWorkspaceRoles.ts";
import authenticate from "../../middlewares/authenticate.ts";

const workspaceRouter = express.Router();

const workspaceController = new WorkspaceController();

workspaceRouter.post(
  "/",
  authenticate,
  validate(createWorkspaceSchema),
  asyncHandler(workspaceController.createWorkspace),
);

workspaceRouter.get(
  "/",
  authenticate,
  asyncHandler(workspaceController.getMyWorkspaces),
);

workspaceRouter.get(
  "/:id",
  authenticate,
  asyncHandler(workspaceController.getWorkspaceById),
);

workspaceRouter.patch(
  "/:id",
  authenticate,
  validate(updateWorkspaceSchema),
  // NOTE: this route's workspace id param is named "id", not "workspaceId"
  // (unlike every nested resource route below it), so the param name must
  // be passed explicitly or every request here would 403.
  requireWorkspaceRole(["OWNER", "ADMIN"], "id"),
  asyncHandler(workspaceController.updateWorkspace),
);

workspaceRouter.delete(
  "/:id",
  authenticate,
  requireWorkspaceRole(["OWNER", "ADMIN"], "id"),
  asyncHandler(workspaceController.deleteWorkspace),
);

workspaceRouter.post(
  "/:workspaceId/members",
  authenticate,
  requireWorkspaceRole(["OWNER", "ADMIN"]),
  asyncHandler(workspaceController.addMember),
);

export default workspaceRouter;
