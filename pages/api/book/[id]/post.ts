import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getBookWithPostsHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

export type BookWithPosts = Prisma.PromiseReturnType<typeof getBookWithPosts>;

async function getBookWithPostsHandler(req: NextApiRequest, res: NextApiResponse<BookWithPosts>) {
  const { id } = req.query;
  const bookID = id as string;

  const book = await getBookWithPosts(bookID);
  if (book) {
    res.status(StatusCodes.OK).json(book);
  }
  else {
    res.status(StatusCodes.NOT_FOUND).json(null);
  }
}

async function getBookWithPosts(id: string) {
  const prisma = new PrismaClient();
  const book = await prisma.book.findFirst({
    where: {
      id: id,
    },
    include: {
      posts: true,
    }
  });

  return book;
}
