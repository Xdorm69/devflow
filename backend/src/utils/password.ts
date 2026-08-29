import bcrypt from "bcryptjs";

// 12 rounds is a reasonable default (~250ms on modern hardware) that balances
// brute-force resistance against login latency. Bump this over time as
// hardware gets faster.
const SALT_ROUNDS = 12;

export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

export async function comparePassword(
  plainTextPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, passwordHash);
}
