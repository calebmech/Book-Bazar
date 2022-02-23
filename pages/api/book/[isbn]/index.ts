import { HttpMethod } from "@lib/http-method";
import { getPopulatedBook } from "@lib/services/book";
import { StatusCodes } from "http-status-codes";
import type { NextApiRequest, NextApiResponse } from "next";

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
  const { isbn } = req.query;

  // Confirm that path isbn and queried data are strings
  if (typeof isbn !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  // Get relevant book from the database
  const populatedBook = await getPopulatedBook(isbn);

  // Return response to user
  if (populatedBook) {
    res.status(StatusCodes.OK).json(populatedBook);
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
}
