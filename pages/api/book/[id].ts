// TODO: Add UID Validation similar to PR 27
// https://github.com/calebmech/Book-Bazar/pull/27

import type { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../lib/services/db";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getBookWithPostsHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

async function getBookWithPostsHandler(req: NextApiRequest, res: NextApiResponse) {
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
