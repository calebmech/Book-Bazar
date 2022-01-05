import {prisma} from "@lib/services/db";

/**
 * Get a book's data with it's posts based on the ISBN (International Standard Book Number)
 * @param {string} isbn The 13-digit ISBN code
 * @returns {Promise} An object containing book information and relevant posts
 */
export async function getBookWithPosts(isbn: string) {
  const book = await prisma.book.findFirst({
    where: {
      isbn: isbn,
    },
    include: {
      posts: true,
    }
  });

  return book;
}
