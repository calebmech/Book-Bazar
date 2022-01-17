import { PrismaClient } from "@prisma/client";

export default async () => {
  let prisma = new PrismaClient();

  try {
    // delete all records, except users and sessions
    // HACK: posts must be deleted first,
    // in order to properly get rid of relations in the the DB
    await prisma.post.deleteMany();
    await prisma.book.deleteMany();
    await prisma.course.deleteMany();
    await prisma.dept.deleteMany();
    await prisma.verificationEmail.deleteMany();
    return null;
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    prisma.$disconnect();
  }
};
