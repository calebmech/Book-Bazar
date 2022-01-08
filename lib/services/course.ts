import type { Prisma } from "@prisma/client";
import { prisma } from "@lib/services/db";
import { paginateResults } from "@lib/helpers/backend/paginate";

export type CourseWithBooks = Prisma.PromiseReturnType<typeof getCourseWithBooks>;

/**
 * Returns the course with the given id.
 *
 * @param id the id of the course
 * @returns the course with the given id, or null if the course with the given id cannot be found
 */
export async function getCourseWithBooks(id: string)  {
  return prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      books: true,
    }
  });
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
  const course = await getCourseWithBooksWithPosts(id, includeUser);
  if (course) {
    const postArray = course.books.map(book => book.posts).flat();
    return paginateResults(postArray, length, page);
  }
  else return null;
}

async function getCourseWithBooksWithPosts(id: string, includeUser: boolean) {
  return prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      books: {
        include: {
          posts: {
            include: {
              book: true,
              user: includeUser
            }
          }
        },
      },
    },
  });
} 