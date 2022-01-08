import type { Prisma } from "@prisma/client";
import { prisma } from "@lib/services/db";

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
  return prisma.post.findMany({
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
} 