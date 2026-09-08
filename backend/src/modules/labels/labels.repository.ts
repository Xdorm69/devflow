import { Label } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";
import { CreateLabelInput, UpdateLabelInput } from "./labels.validator.ts";

class LabelRepository {
  async create(workspaceId: string, data: CreateLabelInput): Promise<Label> {
    return await prisma.label.create({
      data: {
        name: data.name,
        color: data.color,
        workspace: { connect: { id: workspaceId } },
      },
    });
  }

  async findById(id: string): Promise<Label | null> {
    return await prisma.label.findUnique({ where: { id } });
  }

  async findByNameInWorkspace(workspaceId: string, name: string): Promise<Label | null> {
    return await prisma.label.findUnique({ where: { workspaceId_name: { workspaceId, name } } });
  }

  async findByWorkspace(workspaceId: string): Promise<Label[]> {
    return await prisma.label.findMany({ where: { workspaceId }, orderBy: { name: "asc" } });
  }

  async update(id: string, data: UpdateLabelInput): Promise<Label> {
    return await prisma.label.update({
      where: { id },
      data: { name: data.name, color: data.color },
    });
  }

  async delete(id: string): Promise<Label> {
    return await prisma.label.delete({ where: { id } });
  }
}

export default LabelRepository;
