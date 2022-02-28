import algoliasearch, { SearchIndex } from "algoliasearch";
import { Book, Course, Dept } from "@prisma/client";
import { prisma } from "../prisma-client/prismaClient";
import { getGoogleBooksData, GoogleBook } from "../helpers/getGoogleBooksData";

export type CourseWithDept = Course & {
  dept: Dept;
};

export type BookWithUserWithCourseWithDept = Book & {
  courses: CourseWithDept[];
};

export type PopulatedBook = BookWithUserWithCourseWithDept & {
  googleBook: GoogleBook | null;
};

enum EntryType {
  BOOK = "book",
  COURSE = "course",
}

interface AlgoliaEntry {
  type: EntryType;
  entry: PopulatedBook | Course;
}

const searchableAttributes: string[] = [
  "entry.dept.abbreviation",
  "entry.dept.name",
  "entry.code",
  "entry.name",
  "entry.isbn",
];

const rankings: string[] = [
  "typo",
  "asc(entry.code)",
  "asc(entry.dept.abbreviation)",
  "asc(entry.dept.name)",
  "attribute",
  "words",
  "proximity",
  "exact",
  "custom",
];

export const getAlgoliaObject = async (): Promise<AlgoliaEntry[]> => {
  const dbBooks: BookWithUserWithCourseWithDept[] = await prisma.book.findMany({
    include: {
      courses: {
        include: {
          dept: true,
        },
      },
    },
  });

  const dbCourses: Course[] = await prisma.course.findMany({
    include: {
      dept: true,
    },
  });

  const algoliaBookEntries: AlgoliaEntry[] = [];

  for (const book of dbBooks) {
    const googleBooksData = await getGoogleBooksData(book.isbn);
    const algoliaBookEntry: AlgoliaEntry = {
      type: EntryType.BOOK,
      entry: { ...book, ...{ googleBook: googleBooksData } },
    };
    algoliaBookEntries.push(algoliaBookEntry);
  }

  const algoliaCourseEntries: AlgoliaEntry[] = dbCourses.map(
    (course: Course) => {
      const algoliaCourseEntry: AlgoliaEntry = {
        type: EntryType.COURSE,
        entry: course,
      };
      return algoliaCourseEntry;
    }
  );

  return algoliaBookEntries.concat(algoliaCourseEntries);
};

const updateAlgoliaObjects = async (index: SearchIndex, data: Object[]) => {
  await index.replaceAllObjects(data, {
    autoGenerateObjectIDIfNotExist: true,
  });
};

const updateAlgoliaSettings = async (index: SearchIndex) => {
  await index.setSettings({
    searchableAttributes: searchableAttributes,
    ranking: rankings,
  });
};

export const updateAlgoliaIndex = async (
  appId: string,
  apiKey: string,
  indexName: string,
  algoliaData: AlgoliaEntry[]
) => {
  const client = algoliasearch(appId, apiKey);

  const index = client.initIndex(indexName);

  await updateAlgoliaObjects(index, algoliaData);

  await updateAlgoliaSettings(index);
};
