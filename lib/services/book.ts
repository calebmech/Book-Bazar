import {prisma} from "@lib/services/db";
import { book, googleBook } from "../../common/types";
import { getGoogleBooksData } from "../helpers/backend/googleBooksSearch";

/**
 * Get a book's data with it's posts based on the ISBN (International Standard Book Number)
 * @param {string} isbn The 13-digit ISBN code
 * @returns {Promise} An object containing book information and relevant posts
 */
export async function getPopulatedBook(isbn: string, includeUser: boolean, length: number, page: number) : Promise<book | null> {
  const populatedBook : book = await prisma.book.findFirst({
    where: {
      isbn: isbn,
    },
    include: {
      posts: {
      // Post pagnation parameters  
      skip: length * page,
      take: length,
      // Select fields needed from the database for the post
      select: {
        id: true,
        price: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        userId: includeUser,
        user: includeUser,
      }
      },
      // Select courses for the book and include the department
      courses: {
        include: {
          dept: true
        }
      },
    }
  });

  if (!populatedBook) return null;

  populatedBook.googleBook = {};

  // Searching by ISBN provides the most accurate result
  const googleBookData = await getGoogleBooksData(populatedBook.isbn);
  if (googleBookData) populatedBook.googleBook = googleBookData as googleBook;


  return populatedBook;

}
