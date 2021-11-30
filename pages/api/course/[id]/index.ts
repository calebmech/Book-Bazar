import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import { HttpMethod } from "@lib/http-method";
import { isValidUUID } from "@lib/helpers/backend/valid-uuid";
import { StatusCodes } from "http-status-codes";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getCourseWithBooksHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

export type CourseWithBooks = Prisma.PromiseReturnType<typeof getCourseWithBooks>;

async function getCourseWithBooksHandler(req: NextApiRequest, res: NextApiResponse<CourseWithBooks>) {
  const { id } = req.query;
  const courseID = id as string;

  if (isValidUUID(courseID)) {
    const course = await getCourseWithBooks(courseID);
    if (course) {
      res.status(StatusCodes.OK).json(course);
    }
    else {
      res.status(StatusCodes.NOT_FOUND).json(null);
    }
  }
  else {
    res.status(StatusCodes.BAD_REQUEST).json(null);
  }
}


async function getCourseWithBooks(id: string) {
  const prisma = new PrismaClient();
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