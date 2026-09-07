import { Prisma, User } from "../../generated/prisma/client";
import ApiError from "../../utils/apiError.ts";
import { signAccessToken, signRefreshToken, TokenPayload, verifyRefreshToken } from "../../utils/jwt.ts";
import { comparePassword, hashPassword } from "../../utils/password.ts";
import { sanitizeUser, SafeUser } from "../../utils/sanitizeUser.ts";
import UserRepository from "../users/users.repository.ts";

interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  private issueTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload: TokenPayload = { sub: user.id, tokenVersion: user.tokenVersion };
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }

  async register(input: { username: string; email: string; password: string }): Promise<AuthResult> {
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.findByEmail(input.email),
      this.userRepository.findByUsername(input.username),
    ]);

    if (existingEmail) {
      throw new ApiError(409, "An account with this email already exists");
    }

    if (existingUsername) {
      throw new ApiError(409, "This username is already taken");
    }

    const passwordHash = await hashPassword(input.password);

    const createInput: Prisma.UserCreateInput = {
      username: input.username,
      email: input.email,
      passwordHash,
    };

    const user = await this.userRepository.create(createInput);
    const { accessToken, refreshToken } = this.issueTokens(user);

    return { user: sanitizeUser(user), accessToken, refreshToken };
  }

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(input.email);

    // Deliberately generic message: don't reveal whether the email exists.
    const invalidCredentialsError = new ApiError(401, "Invalid email or password");

    if (!user) {
      throw invalidCredentialsError;
    }

    const passwordMatches = await comparePassword(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw invalidCredentialsError;
    }

    const { accessToken, refreshToken } = this.issueTokens(user);

    return { user: sanitizeUser(user), accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await this.userRepository.findById(payload.sub);

    // tokenVersion mismatch means the token was revoked (logout-everywhere,
    // password change) since it was issued.
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // Rotate the refresh token on every use so a stolen-but-unused token
    // has a short shelf life.
    return this.issueTokens(user);
  }

  /**
   * Invalidates every refresh token currently issued to this user by
   * bumping their tokenVersion. Used for "log out everywhere" and should
   * also be called whenever the password changes.
   */
  async revokeAllSessions(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      tokenVersion: { increment: 1 },
    });
  }

  /**
   * Best-effort logout. The refresh cookie is always cleared by the caller
   * regardless of this call. If `everywhere` is requested and the refresh
   * token is present and decodable, every session for that user is revoked.
   * A missing/expired/invalid refresh token is not an error here -- the
   * user is being logged out either way.
   */
  async logout(refreshToken: string | undefined, everywhere: boolean): Promise<void> {
    if (!everywhere || !refreshToken) {
      return;
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      await this.revokeAllSessions(payload.sub);
    } catch {
      // Token already invalid/expired -- nothing to revoke.
    }
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return sanitizeUser(user);
  }
}

export default AuthService;
