// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem
import { PrismaClient } from "@prisma/client";

export const prisma: PrismaClient =
  (global as any).prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") (global as any).prisma = prisma;
