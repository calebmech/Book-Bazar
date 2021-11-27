import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCourseWithBooks(id: string) {
  const course = await prisma.course.findFirst({
    where: {
      id: id,
    },
    include: {
      books: true,
    }
  });

  return course;
}

export type CourseWithBooks = Prisma.PromiseReturnType<typeof getCourseWithBooks>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<CourseWithBooks>) {
  const { id } = req.query;
  const courseID = id as string;

  const course = await getCourseWithBooks(courseID);
  if (course) {
    res.status(200).json(course);
  }
  else {
    res.status(404).json(null);
  }
}