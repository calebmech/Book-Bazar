import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getCourseWithBooksWithPostsHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

export type CourseWithBooksWithPosts = Prisma.PromiseReturnType<typeof getCourseWithBooksWithPosts>;

async function getCourseWithBooksWithPostsHandler(req: NextApiRequest, res: NextApiResponse<CourseWithBooksWithPosts>) {
  const { id } = req.query;
  const courseID = id as string;

  const course = await getCourseWithBooksWithPosts(courseID);
  if (course) {
    res.status(StatusCodes.OK).json(course);
  }
  else {
    res.status(StatusCodes.NOT_FOUND).json(null);
  }
}

async function getCourseWithBooksWithPosts(id: string) {
  const prisma = new PrismaClient();
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