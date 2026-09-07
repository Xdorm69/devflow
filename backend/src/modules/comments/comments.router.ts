import express from "express";
import authenticate from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validate.ts";
import { requireWorkspaceRole } from "../../middlewares/workspace/requireWorkspaceRoles.ts";
import asyncHandler from "../../utils/async.ts";
import CommentController from "./comments.controller.ts";
import { createCommentSchema, updateCommentSchema } from "./comments.validator.ts";

// mergeParams: true so :workspaceId, :projectId, and :issueId set by the
// parent routers (workspace -> projects -> issues) are visible here.
const commentsRouter = express.Router({ mergeParams: true });
const commentController = new CommentController();

const anyMember = requireWorkspaceRole(["MEMBER", "ADMIN", "OWNER"]);

commentsRouter.use(authenticate, anyMember);

commentsRouter.post(
  "/",
  validate(createCommentSchema),
  asyncHandler(commentController.createComment),
);

commentsRouter.get("/", asyncHandler(commentController.getComments));

commentsRouter.patch(
  "/:commentId",
  validate(updateCommentSchema),
  asyncHandler(commentController.updateComment),
);

commentsRouter.delete("/:commentId", asyncHandler(commentController.deleteComment));

export default commentsRouter;
