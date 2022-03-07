import { prisma } from "@lib/services/db";
import { getGoogleBooksData, GoogleBook } from "./googleBooksSearch";
import { CourseWithDept } from "./course";
import { Book, Post, User } from "@prisma/client";

export type PostWithUser = Post & {
  user: User;
};

export type BookWithUserWithCourseWithDept = Book & {
  courses: CourseWithDept[];
};

export type PopulatedBook = BookWithUserWithCourseWithDept & {
  googleBook: GoogleBook | null;
};

/**
 * Get a book's data with it's posts based on the ISBN (International Standard Book Number)
 * @param {string} isbn The 13-digit ISBN code
 * @returns {Promise<PopulatedBook | null> } A promise containing book information and relevant posts
 */
export async function getPopulatedBook(
  isbn: string
): Promise<PopulatedBook | null> {
  const populatedBookPrisma: BookWithUserWithCourseWithDept | null =
    await prisma.book.findUnique({
      where: {
        isbn: isbn,
      },
      include: {
        // Select courses for the book and include the department
        courses: {
          include: {
            dept: true,
          },
        },
      },
    });

  if (!populatedBookPrisma) return null;

  // Searching by ISBN provides the most accurate result
  const googleBookData: GoogleBook | null = await getGoogleBooksData(
    populatedBookPrisma.isbn
  );

  const populatedBook: PopulatedBook = {
    ...populatedBookPrisma,
    ...{ googleBook: googleBookData },
  };

  return populatedBook;
}

/**
 * Returns posts belonging to the book with the given isbn.
 *
 * @param isbn isbn of the book
 * @param length the number of posts on one page
 * @param page the index of the page to return
 * @param includeUser whether or not the user associated with the post should be returned in the data
 * @returns an array of posts for the book with the given isbn that is paginated, or null if the book with the given id cannot be found
 */
export async function getPostsForBook(
  isbn: string,
  length: number,
  page: number,
  includeUser: boolean
) {
  const book = await prisma.book.findUnique({
    where: { isbn },
  });

  if (!book) {
    return null;
  }

  return prisma.post.findMany({
    skip: page * length,
    take: length,
    include: {
      book: true,
      user: includeUser,
    },
    where: {
      book: { isbn },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
