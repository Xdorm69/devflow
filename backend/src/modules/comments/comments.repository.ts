import { Comment } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

const commentInclude = {
  author: { select: { id: true, username: true, avatarUrl: true } },
} as const;

class CommentRepository {
  async create(issueId: string, authorId: string, content: string): Promise<Comment> {
    return await prisma.comment.create({
      data: { issueId, authorId, content },
      include: commentInclude,
    });
  }

  async findById(id: string) {
    return await prisma.comment.findUnique({ where: { id }, include: commentInclude });
  }

  async findByIssue(issueId: string) {
    return await prisma.comment.findMany({
      where: { issueId },
      include: commentInclude,
      orderBy: { createdAt: "asc" },
    });
  }

  async update(id: string, content: string): Promise<Comment> {
    return await prisma.comment.update({ where: { id }, data: { content }, include: commentInclude });
  }

  async delete(id: string): Promise<Comment> {
    return await prisma.comment.delete({ where: { id } });
  }
}

export default CommentRepository;
