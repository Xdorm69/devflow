import { User } from "../generated/prisma/client";

export type SafeUser = Omit<User, "passwordHash" | "tokenVersion">;

export function sanitizeUser(user: User): SafeUser {
  const { passwordHash, tokenVersion, ...safeUser } = user;
  return safeUser;
}
