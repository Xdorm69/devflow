import { ActivityType } from "../../generated/prisma/enums.ts";
import ApiError from "../../utils/apiError.ts";
import ActivityService from "../activities/activities.service.ts";
import IssueRepository from "../issues/issues.repository.ts";
import CommentRepository from "./comments.repository.ts";

class CommentService {
  private commentRepository: CommentRepository;
  private issueRepository: IssueRepository;
  private activityService: ActivityService;

  constructor(
    commentRepository: CommentRepository = new CommentRepository(),
    issueRepository: IssueRepository = new IssueRepository(),
    activityService: ActivityService = new ActivityService(),
  ) {
    this.commentRepository = commentRepository;
    this.issueRepository = issueRepository;
    this.activityService = activityService;
  }

  private async assertIssueExists(issueId: string) {
    const issue = await this.issueRepository.findById(issueId);
    if (!issue) throw new ApiError(404, "Issue not found");
    return issue;
  }

  private async getOwnedComment(issueId: string, commentId: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment || comment.issueId !== issueId) {
      throw new ApiError(404, "Comment not found");
    }
    return comment;
  }

  async createComment(issueId: string, authorId: string, content: string) {
    await this.assertIssueExists(issueId);

    const comment = await this.commentRepository.create(issueId, authorId, content);
    await this.activityService.log(issueId, authorId, ActivityType.COMMENT_ADDED, {
      commentId: comment.id,
    });

    return { comment };
  }

  async getComments(issueId: string) {
    await this.assertIssueExists(issueId);
    const comments = await this.commentRepository.findByIssue(issueId);
    return { comments };
  }

  async updateComment(issueId: string, commentId: string, userId: string, content: string) {
    const comment = await this.getOwnedComment(issueId, commentId);

    if (comment.authorId !== userId) {
      throw new ApiError(403, "You can only edit your own comments");
    }

    const updated = await this.commentRepository.update(commentId, content);
    return { comment: updated };
  }

  async deleteComment(
    issueId: string,
    commentId: string,
    userId: string,
    isWorkspaceAdmin: boolean,
  ) {
    const comment = await this.getOwnedComment(issueId, commentId);

    if (comment.authorId !== userId && !isWorkspaceAdmin) {
      throw new ApiError(403, "You can only delete your own comments");
    }

    const deleted = await this.commentRepository.delete(commentId);
    return { comment: deleted };
  }
}

export default CommentService;
