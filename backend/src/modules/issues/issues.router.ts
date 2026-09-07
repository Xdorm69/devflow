import express from "express";
import authenticate from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validate.ts";
import { requireWorkspaceRole } from "../../middlewares/workspace/requireWorkspaceRoles.ts";
import asyncHandler from "../../utils/async.ts";
import commentsRouter from "../comments/comments.router.ts";
import IssueController from "./issues.controller.ts";
import {
  assigneeSchema,
  createIssueSchema,
  labelLinkSchema,
  listIssuesQuerySchema,
  updateIssueSchema,
  updatePrioritySchema,
  updateStatusSchema,
} from "./issues.validator.ts";

// mergeParams: true is required at every level of this nesting chain
// (projects -> issues -> comments) so :workspaceId and :projectId set by
// the parent routers are visible here.
const issuesRouter = express.Router({ mergeParams: true });
const issueController = new IssueController();

const anyMember = requireWorkspaceRole(["MEMBER", "ADMIN", "OWNER"]);
const adminOnly = requireWorkspaceRole(["ADMIN", "OWNER"]);

issuesRouter.use(authenticate);

issuesRouter.post(
  "/",
  anyMember,
  validate(createIssueSchema),
  asyncHandler(issueController.createIssue),
);

issuesRouter.get(
  "/",
  anyMember,
  validate(listIssuesQuerySchema, "query"),
  asyncHandler(issueController.getIssues),
);

issuesRouter.get("/:issueId", anyMember, asyncHandler(issueController.getIssueById));

issuesRouter.patch(
  "/:issueId",
  anyMember,
  validate(updateIssueSchema),
  asyncHandler(issueController.updateIssue),
);

issuesRouter.patch(
  "/:issueId/status",
  anyMember,
  validate(updateStatusSchema),
  asyncHandler(issueController.updateStatus),
);

issuesRouter.patch(
  "/:issueId/priority",
  anyMember,
  validate(updatePrioritySchema),
  asyncHandler(issueController.updatePriority),
);

issuesRouter.delete("/:issueId", adminOnly, asyncHandler(issueController.deleteIssue));

issuesRouter.post(
  "/:issueId/assignees",
  anyMember,
  validate(assigneeSchema),
  asyncHandler(issueController.assignUser),
);

issuesRouter.delete(
  "/:issueId/assignees/:userId",
  anyMember,
  asyncHandler(issueController.unassignUser),
);

issuesRouter.post(
  "/:issueId/labels",
  anyMember,
  validate(labelLinkSchema),
  asyncHandler(issueController.addLabel),
);

issuesRouter.delete(
  "/:issueId/labels/:labelId",
  anyMember,
  asyncHandler(issueController.removeLabel),
);

issuesRouter.get("/:issueId/activities", anyMember, asyncHandler(issueController.getActivities));

issuesRouter.use("/:issueId/comments", commentsRouter);

export default issuesRouter;
