import { ActivityType, IssuePriority, IssueStatus } from "../../generated/prisma/enums.ts";
import ApiError from "../../utils/apiError.ts";
import { getWorkspaceMembership } from "../../utils/cached/workspace.ts";
import ActivityService from "../activities/activities.service.ts";
import LabelRepository from "../labels/labels.repository.ts";
import ProjectRepository from "../projects/projects.repository.ts";
import IssueRepository from "./issues.repository.ts";
import { CreateIssueInput, ListIssuesQuery, UpdateIssueInput } from "./issues.validator.ts";

class IssueService {
  private issueRepository: IssueRepository;
  private projectRepository: ProjectRepository;
  private labelRepository: LabelRepository;
  private activityService: ActivityService;

  constructor(
    issueRepository: IssueRepository = new IssueRepository(),
    projectRepository: ProjectRepository = new ProjectRepository(),
    labelRepository: LabelRepository = new LabelRepository(),
    activityService: ActivityService = new ActivityService(),
  ) {
    this.issueRepository = issueRepository;
    this.projectRepository = projectRepository;
    this.labelRepository = labelRepository;
    this.activityService = activityService;
  }

  /** 404s unless `projectId` exists inside `workspaceId`. */
  private async assertProjectInWorkspace(workspaceId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project || project.workspaceId !== workspaceId) {
      throw new ApiError(404, "Project not found");
    }
    return project;
  }

  /** 404s unless `issueId` exists inside `projectId`. Returns the issue. */
  private async getOwnedIssue(projectId: string, issueId: string) {
    const issue = await this.issueRepository.findById(issueId);
    if (!issue || issue.projectId !== projectId) {
      throw new ApiError(404, "Issue not found");
    }
    return issue;
  }

  async createIssue(
    workspaceId: string,
    projectId: string,
    creatorId: string,
    data: CreateIssueInput,
  ) {
    await this.assertProjectInWorkspace(workspaceId, projectId);

    const issue = await this.issueRepository.create(projectId, creatorId, data);
    await this.activityService.log(issue.id, creatorId, ActivityType.ISSUE_CREATED);

    return { issue };
  }

  async getIssues(workspaceId: string, projectId: string, filters: ListIssuesQuery) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    const issues = await this.issueRepository.findByProject(projectId, filters);
    return { issues };
  }

  async getIssueById(workspaceId: string, projectId: string, issueId: string) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    const issue = await this.getOwnedIssue(projectId, issueId);
    return { issue };
  }

  async updateIssue(
    workspaceId: string,
    projectId: string,
    issueId: string,
    userId: string,
    data: UpdateIssueInput,
  ) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    await this.getOwnedIssue(projectId, issueId);

    const issue = await this.issueRepository.update(issueId, data);
    await this.activityService.log(issueId, userId, ActivityType.ISSUE_UPDATED, {
      fields: Object.keys(data),
    });

    return { issue };
  }

  async updateStatus(
    workspaceId: string,
    projectId: string,
    issueId: string,
    userId: string,
    status: IssueStatus,
  ) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    const existing = await this.getOwnedIssue(projectId, issueId);

    const issue = await this.issueRepository.updateStatus(issueId, status);
    await this.activityService.log(issueId, userId, ActivityType.STATUS_CHANGED, {
      from: existing.status,
      to: status,
    });

    return { issue };
  }

  async updatePriority(
    workspaceId: string,
    projectId: string,
    issueId: string,
    userId: string,
    priority: IssuePriority,
  ) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    const existing = await this.getOwnedIssue(projectId, issueId);

    const issue = await this.issueRepository.updatePriority(issueId, priority);
    await this.activityService.log(issueId, userId, ActivityType.PRIORITY_CHANGED, {
      from: existing.priority,
      to: priority,
    });

    return { issue };
  }

  async deleteIssue(workspaceId: string, projectId: string, issueId: string) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    await this.getOwnedIssue(projectId, issueId);

    const issue = await this.issueRepository.delete(issueId);
    return { issue };
  }

  async assignUser(
    workspaceId: string,
    projectId: string,
    issueId: string,
    actingUserId: string,
    assigneeId: string,
  ) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    await this.getOwnedIssue(projectId, issueId);

    const membership = await getWorkspaceMembership(workspaceId, assigneeId);
    if (!membership) {
      throw new ApiError(400, "User is not a member of this workspace");
    }

    const existing = await this.issueRepository.findAssignee(issueId, assigneeId);
    if (existing) {
      throw new ApiError(409, "User is already assigned to this issue");
    }

    await this.issueRepository.addAssignee(issueId, assigneeId);
    await this.activityService.log(issueId, actingUserId, ActivityType.ISSUE_ASSIGNED, {
      assigneeId,
    });

    const issue = await this.issueRepository.findById(issueId);
    return { issue };
  }

  async unassignUser(
    workspaceId: string,
    projectId: string,
    issueId: string,
    actingUserId: string,
    assigneeId: string,
  ) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    await this.getOwnedIssue(projectId, issueId);

    const existing = await this.issueRepository.findAssignee(issueId, assigneeId);
    if (!existing) {
      throw new ApiError(404, "User is not assigned to this issue");
    }

    await this.issueRepository.removeAssignee(issueId, assigneeId);
    await this.activityService.log(issueId, actingUserId, ActivityType.ISSUE_UNASSIGNED, {
      assigneeId,
    });

    const issue = await this.issueRepository.findById(issueId);
    return { issue };
  }

  async addLabel(
    workspaceId: string,
    projectId: string,
    issueId: string,
    userId: string,
    labelId: string,
  ) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    await this.getOwnedIssue(projectId, issueId);

    const label = await this.labelRepository.findById(labelId);
    if (!label || label.workspaceId !== workspaceId) {
      throw new ApiError(404, "Label not found in this workspace");
    }

    const existing = await this.issueRepository.findIssueLabel(issueId, labelId);
    if (existing) {
      throw new ApiError(409, "Label is already attached to this issue");
    }

    await this.issueRepository.addLabel(issueId, labelId);
    await this.activityService.log(issueId, userId, ActivityType.LABEL_ADDED, { labelId });

    const issue = await this.issueRepository.findById(issueId);
    return { issue };
  }

  async removeLabel(
    workspaceId: string,
    projectId: string,
    issueId: string,
    userId: string,
    labelId: string,
  ) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    await this.getOwnedIssue(projectId, issueId);

    const existing = await this.issueRepository.findIssueLabel(issueId, labelId);
    if (!existing) {
      throw new ApiError(404, "Label is not attached to this issue");
    }

    await this.issueRepository.removeLabel(issueId, labelId);
    await this.activityService.log(issueId, userId, ActivityType.LABEL_REMOVED, { labelId });

    const issue = await this.issueRepository.findById(issueId);
    return { issue };
  }

  async getActivities(workspaceId: string, projectId: string, issueId: string) {
    await this.assertProjectInWorkspace(workspaceId, projectId);
    await this.getOwnedIssue(projectId, issueId);

    const activities = await this.activityService.getForIssue(issueId);
    return { activities };
  }
}

export default IssueService;
