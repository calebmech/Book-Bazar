import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getBooksForCourse(id: string) {
  const course = await prisma.course.findFirst({
    where: {
      id: id,
    },
    include: {
      books: true,
    }
  });

  return course ? course.books : null;
}

export type Books = Prisma.PromiseReturnType<typeof getBooksForCourse>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Books>) {
  const { id } = req.query;
  const courseID = id as string;

  const course = await getBooksForCourse(courseID);
  if (course) {
    res.status(200).json(course);
  }
  else {
    res.status(404).json(null);
  }
}