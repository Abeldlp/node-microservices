import { PrismaClient, User as UserModel } from "@prisma/client";
const prisma = new PrismaClient();

export class User {
  async getAll(): Promise<UserModel[]> {
    const users = await prisma.user.findMany();
    return users;
  }

  async getByEmail(userEmail: string): Promise<UserModel | null> {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    return user;
  }

  async create(userData: {
    email: string;
    password: string;
    username: string;
    role_id?: number;
  }): Promise<UserModel | null> {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: userData.password,
          username: userData.username,
          roleId: userData.role_id || null,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
