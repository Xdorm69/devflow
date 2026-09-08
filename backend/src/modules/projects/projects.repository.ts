import { Project } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";
import { CreateProjectInput, UpdateProjectInput } from "./projects.validator.ts";

class ProjectRepository {
  async create(workspaceId: string, data: CreateProjectInput): Promise<Project> {
    return await prisma.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        workspace: { connect: { id: workspaceId } },
      },
    });
  }

  async findById(id: string): Promise<Project | null> {
    return await prisma.project.findUnique({ where: { id } });
  }

  async findBySlugInWorkspace(workspaceId: string, slug: string): Promise<Project | null> {
    return await prisma.project.findUnique({
      where: { workspaceId_slug: { workspaceId, slug } },
    });
  }

  async findByWorkspace(workspaceId: string): Promise<Project[]> {
    return await prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project> {
    return await prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    });
  }

  async delete(id: string): Promise<Project> {
    return await prisma.project.delete({ where: { id } });
  }
}

export default ProjectRepository;
