import {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from "../../generated/prisma/client";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspace.validator";

export class WorkspaceRepository {
  //workspace
  async create(data: CreateWorkspaceInput): Promise<Workspace> {
    const workspace =  await prisma.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        owner: {
          connect: {
            id: data.ownerId,
          },
        },
      },
    });
    
    //making an owner entry
    await this.addMember(workspace.id, data.ownerId, WorkspaceRole.OWNER);

    return workspace;
  }

  async findById(id: string): Promise<Workspace | null> {
    return await prisma.workspace.findUnique({
      where: {
        id,
      },
    });
  }
  async findBySlug(slug: string): Promise<Workspace | null> {
    return await prisma.workspace.findUnique({
      where: {
        slug,
      },
    });
  }

  async findUserWorkspaces(userId: string): Promise<Workspace[]> {
    return await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findUserOwnedWorkspaces(userId: string): Promise<Workspace[]> {
    return await prisma.workspace.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  async findAll(): Promise<Workspace[]> {
    return await prisma.workspace.findMany();
  }

  async update(
    id: string,
    data: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return await prisma.workspace.update({
      where: {
        id,
      },
      data: {
        name: data.name ? data.name : undefined,
        slug: data.slug ? data.slug : undefined,
        description: data.description ? data.description : undefined,
      },
    });
  }

  async delete(id: string): Promise<Workspace> {
    return await prisma.workspace.delete({
      where: {
        id,
      },
    });
  }

  //members
  async addMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ): Promise<WorkspaceMember> {
    return await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
    });
  }

  async findMember(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMember | null> {
    return await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }

  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async removeMember(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMember> {
    return await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ): Promise<WorkspaceMember> {
    return await prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        role,
      },
    });
  }
}
