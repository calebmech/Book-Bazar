import { Book, Course, Dept } from '@prisma/client';
import { prisma } from '../prisma-client/prismaClient.mjs';
import lodash from 'lodash';

export interface CampusStoreEntry {
    book: Book;
    course: Course;
    dept: Dept;
}

const sameBook = (book1: Book, book2: Book): boolean =>
    book1.isbn === book2.isbn;

const updateDepartments = async (
    campusStoreData: CampusStoreEntry[]
): Promise<CampusStoreEntry[]> => {
    const currentDbDept: Dept[] = await prisma.dept.findMany();

    /*  This for loop updates the following
        1. The deptId of campus store data extracted in this file
        2. The departments in the database
    */
    for (let d = 0; d < campusStoreData.length; d++) {
        // Find out if the current department for a campus store entry exists in the database.
        const department = currentDbDept.filter((book) => {
            return book.abbreviation === campusStoreData[d].dept.abbreviation;
        });

        // If the department exists, update the current campus store data with the correct id
        // and move on.
        if (department.length !== 0) {
            campusStoreData[d].dept.id = department[0].id;
            campusStoreData[d].course.deptId = department[0].id;
            continue;
        }

        // If the department does not exist, create it with the UUID previously generated and move on
        const deptPrisma = await prisma.dept.create({
            data: campusStoreData[d].dept,
        });

        // Update the current database department array being used in the for loop
        currentDbDept.push(campusStoreData[d].dept);
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
        lodash.isEqual
    );

    // Update or create required courses
    for (let c = 0; c < coursesToUpsert.length; c++) {
        const coursePrisma = await prisma.course.upsert({
            where: {
                courseIdentifier: {
                    deptId: coursesToUpsert[c].deptId,
                    code: coursesToUpsert[c].code,
                },
            },
            update: {
                name: coursesToUpsert[c].name,
                term: coursesToUpsert[c].term,
            },
            create: coursesToUpsert[c],
        });
    }

    // Delete all courses that are not mentioned in the book store anymore (will not be offered)
    const coursesToDelete = lodash.differenceWith(
        currentDbCourses,
        campusStoreCourses,
        lodash.isEqual
    );

    for (let toDelete = 0; toDelete < coursesToDelete.length; toDelete++) {
        const deletedCourses = await prisma.course.delete({
            where: {
                id: coursesToDelete[toDelete].id,
            },
        });
    }
};

// Update the book data
const updateBooks = async (campusStoreData: CampusStoreEntry[]) => {
    // Update or create data for all books in the campus store
    for (let b = 0; b < campusStoreData.length; b++) {
        /* Create the courseConnection that wil be upserted
        if there is an update being completed. */
        const courseConnection = {
            connect: {
                courseIdentifier: {
                    deptId: campusStoreData[b].course.deptId,
                    code: campusStoreData[b].course.code,
                },
            },
        };

        // Create the courseConnection that wil be upserted
        // if there is a create being completed
        const bookConnection = {
            ...campusStoreData[b].book,
            ...{
                courses: courseConnection,
            },
        };

        // Upsert book data
        const bookPrisma = await prisma.book.upsert({
            where: {
                isbn: campusStoreData[b].book.isbn,
            },
            update: {
                campusStorePrice: campusStoreData[b].book.campusStorePrice,
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

    for (let b = 0; b < booksNotInCampusStore.length; b++) {
        const notInCampusStorePrisma = await prisma.book.update({
            where: {
                isbn: booksNotInCampusStore[b].isbn,
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
        throw Error('An error occured while updating the departments.');
    }

    try {
        await updateCourses(campusStoreData);
    } catch (e) {
        console.error(e);
        throw Error('An error occured while updating the courses.');
    }

    try {
        await updateBooks(campusStoreData);
    } catch (e) {
        console.error(e);
        throw Error('An error occured while updating the books.');
    }
};
