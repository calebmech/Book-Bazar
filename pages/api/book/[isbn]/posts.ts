import { isAuthenticated } from "@lib/helpers/backend/user-helpers";
import { HttpMethod } from "@lib/http-method";
import { getPostsForBook } from "@lib/services/book";
import { StatusCodes } from "http-status-codes";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getPostsForBookHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

async function getPostsForBookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { isbn, length, page } = req.query;

  // Confirm that path isbn and queried data are strings
  if (Array.isArray(isbn) || Array.isArray(length) || Array.isArray(page)) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  // Store the results of the query
  let lengthInt: number = parseInt(length);
  let pageInt: number = parseInt(page);
  if (!(lengthInt >= 0)) {
    lengthInt = 20;
  }
  if (!(pageInt >= 0)) {
    pageInt = 0;
  }

  const includeUser: boolean = await isAuthenticated(req, res);

  const posts = await getPostsForBook(isbn, lengthInt, pageInt, includeUser);

  // Return response to user
  if (posts) {
    res.status(StatusCodes.OK).json(posts);
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
}
