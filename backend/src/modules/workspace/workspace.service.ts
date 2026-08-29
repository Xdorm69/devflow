import { Workspace, WorkspaceMember, WorkspaceRole } from "../../generated/prisma/client";
import ApiError from "../../utils/apiError";
import { WorkspaceRepository } from "./workspace.repository";
import { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspace.validator";

export class WorkspaceService {
  private workspaceRepository: WorkspaceRepository;
  constructor(
    workspaceRepository: WorkspaceRepository = new WorkspaceRepository(),
  ) {
    this.workspaceRepository = workspaceRepository;
  }

  async createWorkspace(data: CreateWorkspaceInput): Promise<{workspace: Workspace}> {
    // verify if either same workspace already exists
    const workspaceBySlug = await this.workspaceRepository.findBySlug(data.slug);

    if (workspaceBySlug) {
      throw new ApiError(409, "Workspace with this slug already exists");
    }

    // validation is already done in 
    const workspace = await this.workspaceRepository.create(data);
    return {workspace};
  }

  async getMyWorkspaces(userId: string): Promise<{ownedWorkspaces: Workspace[], memberWorkspaces: Workspace[]}> {
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
    const [memberWorkspaces, ownedWorkspaces] = await Promise.all([
      this.workspaceRepository.findUserWorkspaces(userId),
      this.workspaceRepository.findUserOwnedWorkspaces(userId),
    ]);
    return {ownedWorkspaces, memberWorkspaces};
  }

  async updateWorkspace(workspaceId: string, data: UpdateWorkspaceInput, userId: string): Promise<{workspace: Workspace}> {
    if (!workspaceId) throw new ApiError(400, "Workspace id is required");

    //update permission should stay only by owner
    const old = await this.workspaceRepository.findById(workspaceId);

    if (!old) throw new ApiError(400, `No workspace with id '${workspaceId}' exists`);
    
    if (old.ownerId !== userId) throw new ApiError(401, "Unauthorized to update this workspace");

    if (data.slug) {
        const slugExists = await this.workspaceRepository.findBySlug(data.slug);
        if (slugExists) throw new ApiError(400, `${data.slug} slug already exists`);
    }

    const updatedWorkspace = await this.workspaceRepository.update(workspaceId, data);
    return {workspace: updatedWorkspace};
  }

  async getWorkspaceById(id: string): Promise<{workspace: Workspace}> {
    if (!id) throw new ApiError(400, "Workspace id is required");

    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) throw new ApiError(404, "Workspace not found");
    
    return {workspace};
  }

  async deleteWorkspace(id: string): Promise<{workspace: Workspace}> {
    if (!id) throw new ApiError(400, "Workspace id is required");
    const deletedWorkspace = await this.workspaceRepository.delete(id);
    return {workspace: deletedWorkspace};
  }

  async addMember(workspaceId: string, memberId: string): Promise<{member: WorkspaceMember}> {
    if (!workspaceId) throw new ApiError(400, "Workspace id is required");
    if (!memberId) throw new ApiError(400, "Member id is required");

    const addedMember = await this.workspaceRepository.addMember(workspaceId, memberId, WorkspaceRole.MEMBER);
    return {member: addedMember};
  }
}



