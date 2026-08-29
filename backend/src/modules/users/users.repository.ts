import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma.ts";

class UserRepository {
  async create(data: Prisma.UserCreateInput) {
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

  async update(id: string, data: Prisma.UserUpdateInput) {
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
