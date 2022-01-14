import type { Prisma, User } from "@prisma/client";
import { prisma } from "@lib/services/db";
import { deleteImage, uploadImage } from "./image";

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

export type ModifiableUser = { name?: string; image?: Buffer };

export async function updateUser(
  id: string,
  updatedProperties: ModifiableUser
) {
  let imageUrl: string | undefined;

  if (updatedProperties.image) {
    imageUrl = await uploadImage(updatedProperties.image);
  }

  try {
    const currentUser = await prisma.user.findUnique({ where: { id } });

    if (!currentUser) {
      throw new Error(`User ${id} does not exist`);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: updatedProperties.name,
        imageUrl: imageUrl,
      },
    });

    if (updatedUser.imageUrl && currentUser.imageUrl) {
      await deleteImage(currentUser.imageUrl);
    }

    return updatedUser;
  } catch (e) {
    if (imageUrl) {
      await deleteImage(imageUrl);
    }
    throw e;
  }
}

export async function deleteUser(id: string) {
  const user = await prisma.user.delete({ where: { id } });

  if (user.imageUrl) {
    await deleteImage(user.imageUrl);
  }

  return user;
}
