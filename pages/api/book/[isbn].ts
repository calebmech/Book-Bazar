import type { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import { getBookWithPosts } from "../../../lib/services/book";

var ISBN = require('isbn').ISBN;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getBookWithPostsHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

async function getBookWithPostsHandler(req: NextApiRequest, res: NextApiResponse) {

  const { isbn } = req.query;

  if (Array.isArray(isbn) || !ISBN?.parse(isbn)){
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  const book = await getBookWithPosts(isbn);

  if (book) {
    res.status(StatusCodes.OK).json(book);
  }
  else {
    res.status(StatusCodes.NOT_FOUND).end();
  }

}
