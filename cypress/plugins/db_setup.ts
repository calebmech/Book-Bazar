import { PrismaClient, User } from "@prisma/client";
import {
  TEST_BOOK_UUID,
  TEST_BOOK_1_ISBN,
  TEST_BOOK_2_ISBN,
  TEST_COURSE_UUID,
  TEST_OTHER_PERSON_POST_UUID,
  TEST_POST_1_UUID,
  TEST_POST_2_UUID,
  TEST_POST_UUID,
  TEST_USER,
  TEST_USER_UUID,
  TEST_COURSE,
  TEST_DEPARTMENT,
  TEST_BOOK,
  TEST_POSTS,
} from "../../cypress/support/constants";

export default async () => {
  let prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: TEST_USER as User,
    });
    await prisma.dept.create({
      data: TEST_DEPARTMENT,
    });
    await prisma.course.create({
      data: TEST_COURSE,
    });
    await prisma.book.create({
      data: TEST_BOOK,
    });
    await prisma.book.create({
      data: {
        isbn: TEST_BOOK_2_ISBN,
        name: "GLF 108 GOLF COURSE TOPOGRAPHIC BASE PLAN MAP 27",
        isCampusStoreBook: true,
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
        imageUrl:
          "https://book-bazar-images.s3.us-east-2.amazonaws.com/77498c29-6771-4786-a5b7-fcfeea506d11",
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
        imageUrl:
          "https://book-bazar-images.s3.us-east-2.amazonaws.com/77498c29-6771-4786-a5b7-fcfeea506d11",
        id: TEST_OTHER_PERSON_POST_UUID,
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
        description: "This is my book :O",
        price: 21,
        imageUrl:
          "https://book-bazar-images.s3.us-east-2.amazonaws.com/77498c29-6771-4786-a5b7-fcfeea506d11",
        id: TEST_POST_1_UUID,
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
        description: "Wow another one",
        price: 51,
        imageUrl:
          "https://book-bazar-images.s3.us-east-2.amazonaws.com/77498c29-6771-4786-a5b7-fcfeea506d11",
        id: TEST_POST_2_UUID,
      },
    });

    await prisma.post.createMany({ data: TEST_POSTS });

    return null;
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
};
