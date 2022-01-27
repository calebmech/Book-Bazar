import type { NextApiRequest, NextApiResponse } from "next";
import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import { getPopulatedBook } from "../../../lib/services/book";
import { isAuthenticated } from "@lib/helpers/backend/user-helpers";
import { PopulatedBook } from "../../../lib/services/book";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getPopulatedBookHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

async function getPopulatedBookHandler(
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
  if (!(lengthInt >= 0 && pageInt >= 0)) {
    lengthInt = 20;
    pageInt = 0;
  }

  const includeUser: boolean = await isAuthenticated(req, res);

  // Get relevant book from the database
  const populatedBook: PopulatedBook | null = await getPopulatedBook(
    isbn,
    includeUser,
    lengthInt,
    pageInt
  );

  // Return response to user
  if (populatedBook) {
    res.status(StatusCodes.OK).json(populatedBook);
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
}
