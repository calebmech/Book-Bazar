import { PrismaClient, User } from "@prisma/client";
import {
  TEST_BOOK_UUID,
  TEST_OTHER_PERSON_POST_UUID,
  TEST_POST_UUID,
  TEST_USER,
  TEST_USER_UUID,
} from "../../cypress/support/constants";

export default async () => {
  let prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: TEST_USER as User,
    });
    await prisma.book.create({
      data: {
        isbn: "9780321573513",
        name: "Algorithms",
        isCampusStoreBook: true,
        id: TEST_BOOK_UUID,
      },
    });
    await prisma.post.create({
      data: {
        book: {
          connect: {
            id: TEST_BOOK_UUID,
          },
        },
        user: {
          connect: {
            id: TEST_USER_UUID,
          },
        },
        description: "This is my book, please buy :D",
        price: 42,
        imageUrl: "https://localhost:1000/image.jpg",
        id: TEST_POST_UUID,
      },
    });
    const otherUser = await prisma.user.create({
      data: {
        email: "other@mcmaster.ca",
        name: "Other",
      },
    });
    await prisma.post.create({
      data: {
        book: {
          connect: {
            id: TEST_BOOK_UUID,
          },
        },
        user: {
          connect: {
            id: otherUser.id,
          },
        },
        description: "This is not my book D:",
        price: 42,
        imageUrl: "https://localhost:1000/image.jpg",
        id: TEST_OTHER_PERSON_POST_UUID,
      },
    });
    return null;
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
};
