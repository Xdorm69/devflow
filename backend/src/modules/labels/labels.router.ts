import express from "express";
import authenticate from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validate.ts";
import { requireWorkspaceRole } from "../../middlewares/workspace/requireWorkspaceRoles.ts";
import asyncHandler from "../../utils/async.ts";
import LabelController from "./labels.controller.ts";
import { createLabelSchema, updateLabelSchema } from "./labels.validator.ts";

// mergeParams: true so :workspaceId from the parent (workspace) router
// is visible here.
const labelsRouter = express.Router({ mergeParams: true });
const labelController = new LabelController();

const anyMember = requireWorkspaceRole(["MEMBER", "ADMIN", "OWNER"]);
const adminOnly = requireWorkspaceRole(["ADMIN", "OWNER"]);

labelsRouter.use(authenticate);

labelsRouter.post(
  "/",
  adminOnly,
  validate(createLabelSchema),
  asyncHandler(labelController.createLabel),
);

labelsRouter.get("/", anyMember, asyncHandler(labelController.getLabels));

labelsRouter.patch(
  "/:labelId",
  adminOnly,
  validate(updateLabelSchema),
  asyncHandler(labelController.updateLabel),
);

labelsRouter.delete("/:labelId", adminOnly, asyncHandler(labelController.deleteLabel));

export default labelsRouter;
