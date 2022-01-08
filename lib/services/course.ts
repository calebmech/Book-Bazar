import type { Prisma } from "@prisma/client";
import { prisma } from "@lib/services/db";
import { paginateResults } from "@lib/helpers/backend/paginate";

export type CourseWithBooks = Prisma.PromiseReturnType<typeof getCourseWithBooks>;

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