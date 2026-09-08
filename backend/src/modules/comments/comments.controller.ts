import { Request, Response } from "express";
import ApiResponse from "../../utils/apiResponse.ts";
import CommentService from "./comments.service.ts";
import { CreateCommentInput, UpdateCommentInput } from "./comments.validator.ts";

class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService = new CommentService()) {
    this.commentService = commentService;
  }

  createComment = async (req: Request, res: Response) => {
    const { content } = req.body as CreateCommentInput;
    const { comment } = await this.commentService.createComment(
      req.params.issueId as string,
      req.user!.id,
      content,
    );
    res.status(201).json(new ApiResponse(201, "Comment added successfully", { comment }));
  };

  getComments = async (req: Request, res: Response) => {
    const { comments } = await this.commentService.getComments(req.params.issueId as string);
    res.status(200).json(new ApiResponse(200, "Comments fetched successfully", { comments }));
  };

  updateComment = async (req: Request, res: Response) => {
    const { content } = req.body as UpdateCommentInput;
    const { comment } = await this.commentService.updateComment(
      req.params.issueId as string,
      req.params.commentId as string,
      req.user!.id,
      content,
    );
    res.status(200).json(new ApiResponse(200, "Comment updated successfully", { comment }));
  };

  deleteComment = async (req: Request, res: Response) => {
    const role = req.workspaceMembership?.role;
    const isWorkspaceAdmin = role === "ADMIN" || role === "OWNER";

    const { comment } = await this.commentService.deleteComment(
      req.params.issueId as string,
      req.params.commentId as string,
      req.user!.id,
      isWorkspaceAdmin,
    );
    res.status(200).json(new ApiResponse(200, "Comment deleted successfully", { comment }));
  };
}

export default CommentController;
