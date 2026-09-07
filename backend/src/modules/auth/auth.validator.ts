import { z } from "zod";

// bcrypt silently truncates/ignores bytes beyond 72, so cap password length
// there rather than letting the tail of a long passphrase be meaningless.
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(72, "Password must be at most 72 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username must be at most 30 characters long")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

export const registerSchema = z.object({
  username: usernameSchema,
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
