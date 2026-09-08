import express from "express";
import authenticate from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validate.ts";
import { requireWorkspaceRole } from "../../middlewares/workspace/requireWorkspaceRoles.ts";
import asyncHandler from "../../utils/async.ts";
import issuesRouter from "../issues/issues.router.ts";
import ProjectController from "./projects.controller.ts";
import { createProjectSchema, updateProjectSchema } from "./projects.validator.ts";

// mergeParams: true so :workspaceId from the parent (workspace) router is
// visible here, and so it keeps propagating down into issuesRouter/
// commentsRouter mounted below.
const projectsRouter = express.Router({ mergeParams: true });
const projectController = new ProjectController();

const anyMember = requireWorkspaceRole(["MEMBER", "ADMIN", "OWNER"]);
const adminOnly = requireWorkspaceRole(["ADMIN", "OWNER"]);

projectsRouter.use(authenticate);

projectsRouter.post(
  "/",
  adminOnly,
  validate(createProjectSchema),
  asyncHandler(projectController.createProject),
);

projectsRouter.get("/", anyMember, asyncHandler(projectController.getProjects));

projectsRouter.get("/:projectId", anyMember, asyncHandler(projectController.getProjectById));

projectsRouter.patch(
  "/:projectId",
  adminOnly,
  validate(updateProjectSchema),
  asyncHandler(projectController.updateProject),
);

projectsRouter.delete("/:projectId", adminOnly, asyncHandler(projectController.deleteProject));

projectsRouter.use("/:projectId/issues", issuesRouter);

export default projectsRouter;
