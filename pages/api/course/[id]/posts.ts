import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import { HttpMethod } from "@lib/http-method";
import { isValidUUID } from "@lib/helpers/backend/valid-uuid";
import { StatusCodes } from "http-status-codes";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getCourseWithBooksWithPostsHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

export type Posts = Prisma.PromiseReturnType<typeof getPosts>;

async function getCourseWithBooksWithPostsHandler(req: NextApiRequest, res: NextApiResponse<Posts>) {
  const { id, length, page } = req.query;
  const courseID = id as string;

  const lengthInt = length ? parseInt(length as string) : 20;
  const pageInt = page ? parseInt(page as string) : 0;

  if (isValidUUID(courseID)) {
    const posts = await getPosts(courseID, lengthInt, pageInt);
    if (posts) {
      res.status(StatusCodes.OK).json(posts);
    }
    else {
      res.status(StatusCodes.NOT_FOUND).json(null);
    }
  }
  else {
    res.status(StatusCodes.BAD_REQUEST).json(null);
  }
}

async function getPosts(id : string, length: number, page: number) {
  const course = await getCourseWithBooksWithPosts(id);
  if (course) {
    const start: number = page*length;
    const end: number = (page+1)*length;
    return course.books.map(book => book.posts).flat().slice(start, end);
  }
  else return null;
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