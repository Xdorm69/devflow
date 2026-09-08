import ApiError from "../../utils/apiError.ts";
import { sanitizeUser, SafeUser } from "../../utils/sanitizeUser.ts";
import UserRepository from "./users.repository.ts";
import { UpdateProfileInput } from "./users.validator.ts";

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async getById(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return sanitizeUser(user);
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<SafeUser> {
    if (data.username) {
      const existing = await this.userRepository.findByUsername(data.username);
      if (existing && existing.id !== userId) {
        throw new ApiError(409, "This username is already taken");
      }
    }

    const updated = await this.userRepository.update(userId, {
      username: data.username,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    });

    return sanitizeUser(updated);
  }

  async search(query: string): Promise<SafeUser[]> {
    const users = await this.userRepository.search(query);
    return users.map(sanitizeUser);
  }
}

export default UserService;
