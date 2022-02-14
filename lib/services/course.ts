import type { Prisma } from "@prisma/client";
import { prisma } from "@lib/services/db";
import { CourseCode } from "@lib/helpers/backend/parse-course-code";

export type CourseWithBooks = Prisma.PromiseReturnType<
  typeof getCourseWithBooks
>;

/**
 * Returns the course with the given id.
 *
 * @param courseCode the code for the course in the following format SFWRENG-3DX4
 * @returns the course with the given courseCode, or null if the course cannot be found
 */
export async function getCourseWithBooks(courseCode: CourseCode) {
  return prisma.course.findFirst({
    where: {
      dept: {
        abbreviation: courseCode.deptAbbreviation,
      },
      code: courseCode.code,
    },
    include: {
      books: true,
    },
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
export async function getPostsForCourse(
  courseCode: CourseCode,
  length: number,
  page: number,
  includeUser: boolean
) {
  const course = await prisma.course.findFirst({
    where: {
      dept: {
        abbreviation: courseCode.deptAbbreviation,
      },
      code: courseCode.code,
    },
    include: {
      books: true,
    },
  });
  
  if (!course) {
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
      book: {
        courses: {
          some: {
            id: course.id,
          },
        },
      },
    },
  });
}
