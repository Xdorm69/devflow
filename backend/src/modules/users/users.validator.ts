import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .optional(),
  bio: z.string().max(280, "Bio must be at most 280 characters long").optional(),
  avatarUrl: z.url("Avatar URL must be a valid URL").optional(),
});

export const searchUsersQuerySchema = z.object({
  q: z.string().trim().min(1, "Search query is required"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SearchUsersQuery = z.infer<typeof searchUsersQuerySchema>;
