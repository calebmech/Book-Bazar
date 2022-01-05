import {prisma} from "@lib/services/db";

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
