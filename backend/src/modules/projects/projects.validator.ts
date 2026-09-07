import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(50, "Slug must be at most 50 characters long")
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens",
  );

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: slugSchema,
  description: z.string().max(1000).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100).optional(),
  slug: slugSchema.optional(),
  description: z.string().max(1000).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
