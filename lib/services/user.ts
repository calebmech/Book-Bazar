import { User } from '@prisma/client';
import { prisma } from '@lib/services/db';

export async function findOrCreateUser(email: string): Promise<User> {
  return prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });
}
