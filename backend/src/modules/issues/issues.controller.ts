import { Request, Response } from "express";
import ApiResponse from "../../utils/apiResponse.ts";
import IssueService from "./issues.service.ts";
import {
  AssigneeInput,
  CreateIssueInput,
  LabelLinkInput,
  ListIssuesQuery,
  UpdateIssueInput,
  UpdatePriorityInput,
  UpdateStatusInput,
} from "./issues.validator.ts";

class IssueController {
  private issueService: IssueService;

  constructor(issueService: IssueService = new IssueService()) {
    this.issueService = issueService;
  }

  private params(req: Request) {
    return {
      workspaceId: req.params.workspaceId as string,
      projectId: req.params.projectId as string,
      issueId: req.params.issueId as string,
    };
  }

  createIssue = async (req: Request, res: Response) => {
    const { workspaceId, projectId } = this.params(req);
    const { issue } = await this.issueService.createIssue(
      workspaceId,
      projectId,
      req.user!.id,
      req.body as CreateIssueInput,
    );
    res.status(201).json(new ApiResponse(201, "Issue created successfully", { issue }));
  };

  getIssues = async (req: Request, res: Response) => {
    const { workspaceId, projectId } = this.params(req);
    const { issues } = await this.issueService.getIssues(
      workspaceId,
      projectId,
      req.query as unknown as ListIssuesQuery,
    );
    res.status(200).json(new ApiResponse(200, "Issues fetched successfully", { issues }));
  };

  getIssueById = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { issue } = await this.issueService.getIssueById(workspaceId, projectId, issueId);
    res.status(200).json(new ApiResponse(200, "Issue fetched successfully", { issue }));
  };

  updateIssue = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { issue } = await this.issueService.updateIssue(
      workspaceId,
      projectId,
      issueId,
      req.user!.id,
      req.body as UpdateIssueInput,
    );
    res.status(200).json(new ApiResponse(200, "Issue updated successfully", { issue }));
  };

  updateStatus = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { status } = req.body as UpdateStatusInput;
    const { issue } = await this.issueService.updateStatus(
      workspaceId,
      projectId,
      issueId,
      req.user!.id,
      status,
    );
    res.status(200).json(new ApiResponse(200, "Issue status updated successfully", { issue }));
  };

  updatePriority = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { priority } = req.body as UpdatePriorityInput;
    const { issue } = await this.issueService.updatePriority(
      workspaceId,
      projectId,
      issueId,
      req.user!.id,
      priority,
    );
    res.status(200).json(new ApiResponse(200, "Issue priority updated successfully", { issue }));
  };

  deleteIssue = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { issue } = await this.issueService.deleteIssue(workspaceId, projectId, issueId);
    res.status(200).json(new ApiResponse(200, "Issue deleted successfully", { issue }));
  };

  assignUser = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { userId } = req.body as AssigneeInput;
    const { issue } = await this.issueService.assignUser(
      workspaceId,
      projectId,
      issueId,
      req.user!.id,
      userId,
    );
    res.status(200).json(new ApiResponse(200, "User assigned successfully", { issue }));
  };

  unassignUser = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { issue } = await this.issueService.unassignUser(
      workspaceId,
      projectId,
      issueId,
      req.user!.id,
      req.params.userId as string,
    );
    res.status(200).json(new ApiResponse(200, "User unassigned successfully", { issue }));
  };

  addLabel = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { labelId } = req.body as LabelLinkInput;
    const { issue } = await this.issueService.addLabel(
      workspaceId,
      projectId,
      issueId,
      req.user!.id,
      labelId,
    );
    res.status(200).json(new ApiResponse(200, "Label attached successfully", { issue }));
  };

  removeLabel = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { issue } = await this.issueService.removeLabel(
      workspaceId,
      projectId,
      issueId,
      req.user!.id,
      req.params.labelId as string,
    );
    res.status(200).json(new ApiResponse(200, "Label removed successfully", { issue }));
  };

  getActivities = async (req: Request, res: Response) => {
    const { workspaceId, projectId, issueId } = this.params(req);
    const { activities } = await this.issueService.getActivities(workspaceId, projectId, issueId);
    res.status(200).json(new ApiResponse(200, "Activities fetched successfully", { activities }));
  };
}

export default IssueController;
