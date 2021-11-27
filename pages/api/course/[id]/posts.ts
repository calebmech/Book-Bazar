import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCourseWithBooksWithPosts(id: string) {
  const course = await prisma.course.findFirst({
    where: {
      id: id,
    },
    include: {
      books: {
        include: {
          posts: true
        },
      },
    },
  });

  return course;
}

export type CourseWithBooksWithPosts = Prisma.PromiseReturnType<typeof getCourseWithBooksWithPosts>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<CourseWithBooksWithPosts>) {
  const { id } = req.query;
  const courseID = id as string;

  const course = await getCourseWithBooksWithPosts(courseID);
  if (course) {
    res.status(200).json(course);
  }
  else {
    res.status(404).json(null);
  }
}