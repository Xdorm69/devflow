import { Project } from "../../generated/prisma/client.ts";
import ApiError from "../../utils/apiError.ts";
import ProjectRepository from "./projects.repository.ts";
import { CreateProjectInput, UpdateProjectInput } from "./projects.validator.ts";

class ProjectService {
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository = new ProjectRepository()) {
    this.projectRepository = projectRepository;
  }

  /** Loads a project and 404s unless it belongs to the given workspace. */
  private async getOwnedProject(workspaceId: string, projectId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    if (!project || project.workspaceId !== workspaceId) {
      throw new ApiError(404, "Project not found");
    }
    return project;
  }

  async createProject(workspaceId: string, data: CreateProjectInput): Promise<{ project: Project }> {
    const existing = await this.projectRepository.findBySlugInWorkspace(workspaceId, data.slug);
    if (existing) {
      throw new ApiError(409, "A project with this slug already exists in this workspace");
    }

    const project = await this.projectRepository.create(workspaceId, data);
    return { project };
  }

  async getProjects(workspaceId: string): Promise<{ projects: Project[] }> {
    const projects = await this.projectRepository.findByWorkspace(workspaceId);
    return { projects };
  }

  async getProjectById(workspaceId: string, projectId: string): Promise<{ project: Project }> {
    const project = await this.getOwnedProject(workspaceId, projectId);
    return { project };
  }

  async updateProject(
    workspaceId: string,
    projectId: string,
    data: UpdateProjectInput,
  ): Promise<{ project: Project }> {
    await this.getOwnedProject(workspaceId, projectId);

    if (data.slug) {
      const existing = await this.projectRepository.findBySlugInWorkspace(workspaceId, data.slug);
      if (existing && existing.id !== projectId) {
        throw new ApiError(409, "A project with this slug already exists in this workspace");
      }
    }

    const project = await this.projectRepository.update(projectId, data);
    return { project };
  }

  async deleteProject(workspaceId: string, projectId: string): Promise<{ project: Project }> {
    await this.getOwnedProject(workspaceId, projectId);
    const project = await this.projectRepository.delete(projectId);
    return { project };
  }
}

export default ProjectService;
