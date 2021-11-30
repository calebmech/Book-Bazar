import { Prisma, Course } from "@prisma/client";
import { prisma } from "@lib/services/db";

export async function getCourseWithBooks(id: string)  {
  const course = await prisma.course.findFirst({
    where: {
      id: id,
    },
    include: {
      books: true,
    }
  });

  return course;
}

export async function getPostsForCourse(id : string, length: number, page: number) {
  const course = await getCourseWithBooksWithPosts(id);
  if (course) {
    const start: number = page*length;
    const end: number = (page+1)*length;
    return course.books.map(book => book.posts).flat().slice(start, end);
  }
  else return null;
}

async function getCourseWithBooksWithPosts(id: string) {
  const course = await prisma.course.findFirst({
    where: {
      id: id,
    },
    include: {
      books: {
        include: {
          posts: true
        },
      },
    },
  });

  return course;
}