import { z } from "zod";

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, "Color must be a hex code, e.g. #22C55E");

export const createLabelSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  color: hexColorSchema,
});

export const updateLabelSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50).optional(),
  color: hexColorSchema.optional(),
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
