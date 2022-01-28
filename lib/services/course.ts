import type { Book, Post, Prisma, User } from "@prisma/client";
import { prisma } from "@lib/services/db";
import { GoogleBook, getGoogleBooksData } from "./googleBooksSearch";
import { PopulatedBook } from "./book";

export type CourseWithBooks = Prisma.PromiseReturnType<typeof getCourseWithBooks>;

/**
 * Returns the course with the given id.
 *
 * @param id the id of the course
 * @returns the course with the given id, or null if the course with the given id cannot be found
 */
export async function getCourseWithBooks(id: string)  {
  const course = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      books: true,
    }
  });

  if (!course) {
    return null;
  }

  const BooksWithAuthors = await Promise.all(course.books.map(async book => {
    const googleBookData: GoogleBook | null = await getGoogleBooksData(
      book.isbn
    );
    const authorString = googleBookData && googleBookData.authors ? googleBookData.authors.join(', ') : null;
    return {
      ...book,
      author: authorString
    };
  }))

  const newCourse = {
    ...course,
    books: BooksWithAuthors,
  }

  return newCourse;
}


export type PostsWithBooksWithAuthorWithUser = Prisma.PromiseReturnType<typeof getPostsForCourse>;

export interface BookWithAuthor {
  author: string | null;
  id: string;
  isbn: string;
  name: string;
  imageUrl: string | null;
  googleBooksId: string | null;
  isCampusStoreBook: boolean;
  campusStorePrice: number | null;
}

/**
 * Returns the course with the given id.
 *
 * @param id the id of the course
 * @param length the number of posts on one page
 * @param page the index of the page to return
 * @param includeUser whether or not the user associated with the post should be returned in the data
 * @returns an array of posts from the course with the given id that is paginated, or null if the course with the given id cannot be found
 */
export async function getPostsForCourse(id : string, length: number, page: number, includeUser: boolean) {
  const course = await prisma.course.findUnique({ 
    where: { 
      id: id 
    }
  })

  if (!course) {
    return null;
  }
  
  const posts = await prisma.post.findMany({
    skip: page * length,
    take: length,
    include: {
      book: true,
      user: includeUser,
    },
    where: {
      book: {
        courses: {
          some: {
            id,
          },
        },
      },
    },
  });
  
  return Promise.all(posts.map(async post => {
    const googleBookData: GoogleBook | null = await getGoogleBooksData(
      post.book.isbn
    );

    const authorString = googleBookData && googleBookData.authors ? googleBookData.authors.join(', ') : null;
    
    const book: BookWithAuthor = {
      ...post.book,
      author: authorString 
    };
    
    const newPost = {
      ...post,
      book: book,
    }

    return newPost
  })) 
} 