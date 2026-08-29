import ApiResponse from "../../utils/apiResponse.ts";
import { WorkspaceService } from "./workspace.service.ts";
import { Request, Response } from "express";
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "./workspace.validator.ts";

export class WorkspaceController {
  private workspaceService: WorkspaceService;
  constructor(workspaceService: WorkspaceService = new WorkspaceService()) {
    this.workspaceService = workspaceService;
  }

  createWorkspace = async (req: Request, res: Response) => {
    const data: CreateWorkspaceInput = req.body;
    const { workspace } = await this.workspaceService.createWorkspace(data);
    return res
      .status(201)
      .json(
        new ApiResponse(201, "Workspace created successfully", { workspace }),
      );
  };

  getMyWorkspaces = async (req: Request, res: Response) => {
    const { ownedWorkspaces, memberWorkspaces } =
      await this.workspaceService.getMyWorkspaces(req.user!.id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "All user workspaces fetched successfully", {
          ownedWorkspaces,
          memberWorkspaces,
        }),
      );
  };

  updateWorkspace = async (req: Request, res: Response) => {
    const updateData = req.body as UpdateWorkspaceInput;
    const targetWorkspaceId = req.params.id as string;

    const { workspace } = await this.workspaceService.updateWorkspace(
      targetWorkspaceId,
      updateData,
      req.user!.id,
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Workspace updated succuessfully", { workspace }),
      );
  };

  getWorkspaceById = async (req: Request, res: Response) => {
    const { workspace } = await this.workspaceService.getWorkspaceById(
      req.params.id as string,
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Workspace fetched succuessfully", { workspace }),
      );
  };

  deleteWorkspace = async (req: Request, res: Response) => {
    const { workspace } = await this.workspaceService.deleteWorkspace(
      req.params.id as string,
    );
    
    return res.status(200).json(
      new ApiResponse(200, "Workspace deleted succuessfully", {
        workspace,
      }),
    );
  };

  addMember = async (req: Request, res: Response) => {
    const data = req.body as { userId: string };

    const { member } = await this.workspaceService.addMember(
      req.params.workspaceId as string,
      data.userId,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Member added succuessfully", { member }),
      );
  };
}
