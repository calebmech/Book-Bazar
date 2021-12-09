import type { Prisma, User } from "@prisma/client";
import { prisma } from "@lib/services/db";

export async function findOrCreateUser(email: string): Promise<User> {
  return prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });
}

export type UserWithPosts = Prisma.PromiseReturnType<typeof getUserWithPosts>;

export async function getUserWithPosts(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });
}

export type ModifiableUser = Pick<User, "name" | "imageUrl">;

export async function updateUser(id: string, updatedUser: ModifiableUser) {
  return prisma.user.update({
    where: { id },
    data: {
      name: updatedUser.name,
      imageUrl: updatedUser.imageUrl,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
