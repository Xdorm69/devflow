import { z } from "zod";
import { IssuePriority, IssueStatus } from "../../generated/prisma/enums.ts";

export const createIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().max(10000).optional(),
  priority: z.enum(IssuePriority).optional(),
});

export const updateIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200).optional(),
  description: z.string().max(10000).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(IssueStatus),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(IssuePriority),
});

export const assigneeSchema = z.object({
  userId: z.string().min(1, "User id is required"),
});

export const labelLinkSchema = z.object({
  labelId: z.string().min(1, "Label id is required"),
});

// Query params always arrive as strings, so these stay optional strings
// here and get validated against the enums in the service layer instead
// of forcing zod to coerce them.
export const listIssuesQuerySchema = z.object({
  status: z.enum(IssueStatus).optional(),
  priority: z.enum(IssuePriority).optional(),
  assigneeId: z.string().optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type UpdatePriorityInput = z.infer<typeof updatePrioritySchema>;
export type AssigneeInput = z.infer<typeof assigneeSchema>;
export type LabelLinkInput = z.infer<typeof labelLinkSchema>;
export type ListIssuesQuery = z.infer<typeof listIssuesQuerySchema>;
