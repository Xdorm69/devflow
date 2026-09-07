import { ActivityType } from "../../generated/prisma/enums.ts";
import { Activity } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

class ActivityRepository {
  async create(data: {
    issueId: string;
    userId: string;
    type: ActivityType;
    // Pass a plain object/array; it's JSON.stringify'd here since SQLite
    // has no native Json column type (see schema.prisma comment).
    metadata?: Record<string, unknown> | null;
  }): Promise<Activity> {
    return await prisma.activity.create({
      data: {
        issueId: data.issueId,
        userId: data.userId,
        type: data.type,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });
  }

  async findByIssue(issueId: string): Promise<Activity[]> {
    return await prisma.activity.findMany({
      where: { issueId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });
  }
}

export default ActivityRepository;
