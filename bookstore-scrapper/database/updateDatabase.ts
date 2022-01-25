import { Book, Course, Dept } from "@prisma/client";
import { prisma } from "../prisma-client/prismaClient";
import lodash from "lodash";

export interface CampusStoreEntry {
  book: Book;
  course: Course;
  dept: Dept;
}

const sameBook = (book1: Book, book2: Book): boolean =>
  book1.isbn === book2.isbn;

const sameCourse = (course1: Course, course2: Course): boolean =>
  course1.deptId === course2.deptId &&
  course1.code === course2.code &&
  course1.term === course2.term &&
  course1.name === course2.name;

const updateDepartments = async (
  campusStoreData: CampusStoreEntry[]
): Promise<CampusStoreEntry[]> => {
  const currentDbDept: Dept[] = await prisma.dept.findMany();

  /*  This for loop updates the following
        1. The deptId of campus store data extracted in this file
        2. The departments in the database
    */
  for (const campusStoreEntry of campusStoreData) {
    // Find out if the current department for a campus store entry exists in the database.
    const department = currentDbDept.filter((book) => {
      return book.abbreviation === campusStoreEntry.dept.abbreviation;
    });

    // If the department exists, update the current campus store data with the correct id
    // and move on.
    if (department.length !== 0) {
      campusStoreEntry.dept.id = department[0].id;
      campusStoreEntry.course.deptId = department[0].id;
    } else {
      // If the department does not exist, create it with the UUID previously generated and move on
      const deptPrisma = await prisma.dept.create({
        data: campusStoreEntry.dept,
      });

      // Update the current database department array being used in the for loop
      currentDbDept.push(campusStoreEntry.dept);
    }
  }

  return campusStoreData;
};

const updateCourses = async (campusStoreData: CampusStoreEntry[]) => {
  // Find all the courses within the current database
  const currentDbCourses: Course[] = await prisma.course.findMany();

  // Isolate all current courses available in the campus store
  const campusStoreCourses: Course[] = lodash.uniqWith(
    campusStoreData.map((m) => m.course),
    lodash.isEqual
  );

  // Find out which courses have different data and must be upserted based on campus store changes
  const coursesToUpsert = lodash.differenceWith(
    campusStoreCourses,
    currentDbCourses,
    sameCourse
  );

  // Update or create required courses
  for (const course of coursesToUpsert) {
    const coursePrisma = await prisma.course.upsert({
      where: {
        courseIdentifier: {
          deptId: course.deptId,
          code: course.code,
        },
      },
      update: {
        name: course.name,
        term: course.term,
      },
      create: course,
    });
  }

  // Delete all courses that are not mentioned in the book store anymore (will not be offered)
  const coursesToDelete = lodash.differenceWith(
    currentDbCourses,
    campusStoreCourses,
    sameCourse
  );

  for (const course of coursesToDelete) {
    const deletedCourses = await prisma.course.delete({
      where: {
        id: course.id,
      },
    });
  }
};

// Update the book data
const updateBooks = async (campusStoreData: CampusStoreEntry[]) => {
  // Update or create data for all books in the campus store
  for (const campusStoreEntry of campusStoreData) {
    /* Create the courseConnection that wil be upserted
        if there is an update being completed. */
    const courseConnection = {
      connect: {
        courseIdentifier: {
          deptId: campusStoreEntry.course.deptId,
          code: campusStoreEntry.course.code,
        },
      },
    };

    // Create the courseConnection that wil be upserted
    // if there is a create being completed
    const bookConnection = {
      ...campusStoreEntry.book,
      ...{
        courses: courseConnection,
      },
    };

    // Upsert book data
    const bookPrisma = await prisma.book.upsert({
      where: {
        isbn: campusStoreEntry.book.isbn,
      },
      update: {
        campusStorePrice: campusStoreEntry.book.campusStorePrice,
        isCampusStoreBook: true,
        courses: courseConnection,
      },
      create: bookConnection,
    });
  }

  /* Assign all books that are not in the campus store anymore
    with false for isCampusStoreBook. */
  const currentDbBooks: Book[] = await prisma.book.findMany();

  const campusStoreBooks: Book[] = campusStoreData.map((m) => m.book);

  const booksNotInCampusStore = lodash.differenceWith(
    currentDbBooks,
    campusStoreBooks,
    sameBook
  );

  for (const nonCampusStoreEntry of booksNotInCampusStore) {
    const notInCampusStorePrisma = await prisma.book.update({
      where: {
        isbn: nonCampusStoreEntry.isbn,
      },
      data: {
        isCampusStoreBook: false,
      },
    });
  }
};

export const updateDatabase = async (campusStoreData: CampusStoreEntry[]) => {
  try {
    campusStoreData = await updateDepartments(campusStoreData);
  } catch (e) {
    console.error(e);
    throw Error("An error occured while updating the departments.");
  }

  try {
    await updateCourses(campusStoreData);
  } catch (e) {
    console.error(e);
    throw Error("An error occured while updating the courses.");
  }

  try {
    await updateBooks(campusStoreData);
  } catch (e) {
    console.error(e);
    throw Error("An error occured while updating the books.");
  }
};
