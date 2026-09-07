import { Label } from "../../generated/prisma/client.ts";
import ApiError from "../../utils/apiError.ts";
import LabelRepository from "./labels.repository.ts";
import { CreateLabelInput, UpdateLabelInput } from "./labels.validator.ts";

class LabelService {
  private labelRepository: LabelRepository;

  constructor(labelRepository: LabelRepository = new LabelRepository()) {
    this.labelRepository = labelRepository;
  }

  private async getOwnedLabel(workspaceId: string, labelId: string): Promise<Label> {
    const label = await this.labelRepository.findById(labelId);
    if (!label || label.workspaceId !== workspaceId) {
      throw new ApiError(404, "Label not found");
    }
    return label;
  }

  async createLabel(workspaceId: string, data: CreateLabelInput): Promise<{ label: Label }> {
    const existing = await this.labelRepository.findByNameInWorkspace(workspaceId, data.name);
    if (existing) {
      throw new ApiError(409, "A label with this name already exists in this workspace");
    }

    const label = await this.labelRepository.create(workspaceId, data);
    return { label };
  }

  async getLabels(workspaceId: string): Promise<{ labels: Label[] }> {
    const labels = await this.labelRepository.findByWorkspace(workspaceId);
    return { labels };
  }

  async updateLabel(
    workspaceId: string,
    labelId: string,
    data: UpdateLabelInput,
  ): Promise<{ label: Label }> {
    await this.getOwnedLabel(workspaceId, labelId);

    if (data.name) {
      const existing = await this.labelRepository.findByNameInWorkspace(workspaceId, data.name);
      if (existing && existing.id !== labelId) {
        throw new ApiError(409, "A label with this name already exists in this workspace");
      }
    }

    const label = await this.labelRepository.update(labelId, data);
    return { label };
  }

  async deleteLabel(workspaceId: string, labelId: string): Promise<{ label: Label }> {
    await this.getOwnedLabel(workspaceId, labelId);
    const label = await this.labelRepository.delete(labelId);
    return { label };
  }
}

export default LabelService;
