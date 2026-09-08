import { Issue, IssueAssignee, IssueLabel } from "../../generated/prisma/client.ts";
import { IssuePriority, IssueStatus } from "../../generated/prisma/enums.ts";
import { prisma } from "../../lib/prisma.ts";
import { CreateIssueInput, ListIssuesQuery, UpdateIssueInput } from "./issues.validator.ts";

// Shared `include` shape so list/detail responses always carry the same
// relations for the frontend to render without a follow-up request.
const issueInclude = {
  creator: { select: { id: true, username: true, avatarUrl: true } },
  assignees: {
    include: { user: { select: { id: true, username: true, avatarUrl: true } } },
  },
  labels: { include: { label: true } },
  _count: { select: { comments: true } },
} as const;

class IssueRepository {
  async create(projectId: string, creatorId: string, data: CreateIssueInput): Promise<Issue> {
    return await prisma.issue.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        priority: data.priority ?? IssuePriority.MEDIUM,
        project: { connect: { id: projectId } },
        creator: { connect: { id: creatorId } },
      },
      include: issueInclude,
    });
  }

  async findById(id: string) {
    return await prisma.issue.findUnique({ where: { id }, include: issueInclude });
  }

  async findByProject(projectId: string, filters: ListIssuesQuery) {
    return await prisma.issue.findMany({
      where: {
        projectId,
        status: filters.status,
        priority: filters.priority,
        assignees: filters.assigneeId ? { some: { userId: filters.assigneeId } } : undefined,
      },
      include: issueInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: UpdateIssueInput): Promise<Issue> {
    return await prisma.issue.update({
      where: { id },
      data: { title: data.title, description: data.description },
      include: issueInclude,
    });
  }

  async updateStatus(id: string, status: IssueStatus): Promise<Issue> {
    return await prisma.issue.update({ where: { id }, data: { status }, include: issueInclude });
  }

  async updatePriority(id: string, priority: IssuePriority): Promise<Issue> {
    return await prisma.issue.update({ where: { id }, data: { priority }, include: issueInclude });
  }

  async delete(id: string): Promise<Issue> {
    return await prisma.issue.delete({ where: { id } });
  }

  async addAssignee(issueId: string, userId: string): Promise<IssueAssignee> {
    return await prisma.issueAssignee.create({ data: { issueId, userId } });
  }

  async removeAssignee(issueId: string, userId: string): Promise<IssueAssignee> {
    return await prisma.issueAssignee.delete({
      where: { issueId_userId: { issueId, userId } },
    });
  }

  async findAssignee(issueId: string, userId: string): Promise<IssueAssignee | null> {
    return await prisma.issueAssignee.findUnique({
      where: { issueId_userId: { issueId, userId } },
    });
  }

  async addLabel(issueId: string, labelId: string): Promise<IssueLabel> {
    return await prisma.issueLabel.create({ data: { issueId, labelId } });
  }

  async removeLabel(issueId: string, labelId: string): Promise<IssueLabel> {
    return await prisma.issueLabel.delete({
      where: { issueId_labelId: { issueId, labelId } },
    });
  }

  async findIssueLabel(issueId: string, labelId: string): Promise<IssueLabel | null> {
    return await prisma.issueLabel.findUnique({
      where: { issueId_labelId: { issueId, labelId } },
    });
  }
}

export default IssueRepository;
