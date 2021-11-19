import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPostsForCourse(id: string) {
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

  // return course ? course.books.map(book => book.posts).flat() : null;

  return course;
}

export type Posts = Prisma.PromiseReturnType<typeof getPostsForCourse>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Posts>) {
  const { id } = req.query;
  const courseID = id as string;

  const course = await getPostsForCourse(courseID);
  if (course) {
    res.status(200).json(course);
  }
  else {
    res.status(404).json(null);
  }
}