import type { Prisma } from "@prisma/client";
import { prisma } from "@lib/services/db";

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
    const start: number = page*length;
    const end: number = (page+1)*length;
    return course.books.map(book => book.posts).flat().slice(start, end);
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