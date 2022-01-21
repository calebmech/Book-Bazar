import { PrismaClient, User } from "@prisma/client";
import {
  TEST_BOOK_UUID,
  TEST_BOOK_1_ISBN,
  TEST_BOOK_2_ISBN,
  TEST_COURSE_UUID,
  TEST_DEPARTMENT_UUID,
  TEST_OTHER_PERSON_POST_UUID,
  TEST_POST_1_UUID,
  TEST_POST_2_UUID,
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
    await prisma.dept.create({
      data: {
        id: TEST_DEPARTMENT_UUID,
        name: "Software Engineering",
        abbreviation: "SFWR",
      },
    });
    await prisma.course.create({
      data: {
        id: TEST_COURSE_UUID,
        name: "Very Hard Course",
        code: "2H03",
        term: "Winter",
        deptId: TEST_DEPARTMENT_UUID,
      },
    });
    await prisma.book.create({
      data: {
        courses: {
          connect: {
            id: TEST_COURSE_UUID,
          },
        },
        id: TEST_BOOK_UUID,
        isbn: TEST_BOOK_1_ISBN,
        name: "Algorithms",
        imageUrl: "https://localhost:1000/image.jpg",
        googleBooksId: "MTpsAQAAQBAJ",
        campusStorePrice: 4000,
        isCampusStoreBook: true,
      },
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
        imageUrl: "https://localhost:1000/image.jpg",
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
        imageUrl: "https://localhost:1000/image.jpg",
        id: TEST_POST_2_UUID,
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
