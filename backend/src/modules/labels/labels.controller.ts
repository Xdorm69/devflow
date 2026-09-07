import { Request, Response } from "express";
import ApiResponse from "../../utils/apiResponse.ts";
import LabelService from "./labels.service.ts";
import { CreateLabelInput, UpdateLabelInput } from "./labels.validator.ts";

class LabelController {
  private labelService: LabelService;

  constructor(labelService: LabelService = new LabelService()) {
    this.labelService = labelService;
  }

  createLabel = async (req: Request, res: Response) => {
    const { label } = await this.labelService.createLabel(
      req.params.workspaceId as string,
      req.body as CreateLabelInput,
    );
    res.status(201).json(new ApiResponse(201, "Label created successfully", { label }));
  };

  getLabels = async (req: Request, res: Response) => {
    const { labels } = await this.labelService.getLabels(req.params.workspaceId as string);
    res.status(200).json(new ApiResponse(200, "Labels fetched successfully", { labels }));
  };

  updateLabel = async (req: Request, res: Response) => {
    const { label } = await this.labelService.updateLabel(
      req.params.workspaceId as string,
      req.params.labelId as string,
      req.body as UpdateLabelInput,
    );
    res.status(200).json(new ApiResponse(200, "Label updated successfully", { label }));
  };

  deleteLabel = async (req: Request, res: Response) => {
    const { label } = await this.labelService.deleteLabel(
      req.params.workspaceId as string,
      req.params.labelId as string,
    );
    res.status(200).json(new ApiResponse(200, "Label deleted successfully", { label }));
  };
}

export default LabelController;
