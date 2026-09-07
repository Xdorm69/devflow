import { Request, Response } from "express";
import ApiResponse from "../../utils/apiResponse.ts";
import ProjectService from "./projects.service.ts";
import { CreateProjectInput, UpdateProjectInput } from "./projects.validator.ts";

class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService = new ProjectService()) {
    this.projectService = projectService;
  }

  createProject = async (req: Request, res: Response) => {
    const data = req.body as CreateProjectInput;
    const { project } = await this.projectService.createProject(
      req.params.workspaceId as string,
      data,
    );
    res.status(201).json(new ApiResponse(201, "Project created successfully", { project }));
  };

  getProjects = async (req: Request, res: Response) => {
    const { projects } = await this.projectService.getProjects(req.params.workspaceId as string);
    res.status(200).json(new ApiResponse(200, "Projects fetched successfully", { projects }));
  };

  getProjectById = async (req: Request, res: Response) => {
    const { project } = await this.projectService.getProjectById(
      req.params.workspaceId as string,
      req.params.projectId as string,
    );
    res.status(200).json(new ApiResponse(200, "Project fetched successfully", { project }));
  };

  updateProject = async (req: Request, res: Response) => {
    const data = req.body as UpdateProjectInput;
    const { project } = await this.projectService.updateProject(
      req.params.workspaceId as string,
      req.params.projectId as string,
      data,
    );
    res.status(200).json(new ApiResponse(200, "Project updated successfully", { project }));
  };

  deleteProject = async (req: Request, res: Response) => {
    const { project } = await this.projectService.deleteProject(
      req.params.workspaceId as string,
      req.params.projectId as string,
    );
    res.status(200).json(new ApiResponse(200, "Project deleted successfully", { project }));
  };
}

export default ProjectController;
