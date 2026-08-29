import { User } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

class UserRepository {
  async create(data: User) {
    return await prisma.user.create({
      data,
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async update(id: string, data: User) {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

export default UserRepository;
