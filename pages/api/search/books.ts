import { paginate } from "@lib/helpers/backend/paginate";
import { prisma } from "@lib/services/db";
import {
  getSearchParamsFromQuery,
  isAlmostSubstring,
  SearchParams,
} from "@lib/services/search";
import { Book } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import leven from "leven";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const searchParams = getSearchParamsFromQuery(req.query);
    try {
      const searchResults = await getSearchResults(searchParams);
      res.status(StatusCodes.OK).json(searchResults);
    } catch (e) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`error finding search results: ${e}`);
    }
  } catch {
    res.status(StatusCodes.BAD_REQUEST).send("invalid search parameters");
  }
}

async function getSearchResults(searchParams: SearchParams): Promise<Book[]> {
  let books = await prisma.book.findMany();
  books = await filterBooks(books, searchParams.searchText);
  if ((searchParams.page - 1) * searchParams.pageLength > books.length) {
    return [];
  }
  books = await orderPosts(books, searchParams.searchText);
  books = paginate(books, searchParams.pageLength, searchParams.page);
  return books;
}

async function filterBooks(books: Book[], searchText: string): Promise<Book[]> {
  return books.filter((book: Book) => isAlmostSubstring(searchText, book.name));
}

async function orderPosts(books: Book[], searchText: string): Promise<Book[]> {
  return books.sort(
    (bookA: Book, bookB: Book) =>
      leven(searchText, bookA.name) - leven(searchText, bookB.name)
  );
}
