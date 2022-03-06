import algoliasearch, { SearchIndex } from "algoliasearch";
import { Book, Course, Dept } from "@prisma/client";
import { prisma } from "../prisma-client/prismaClient";
import { getGoogleBooksData, GoogleBook } from "../helpers/getGoogleBooksData";

// If node env is not provided in command line, default to values in env.development
if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
require("dotenv").config({ path: `../.env.${process.env.NODE_ENV}` });

export const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
export const ALGOLIA_API_KEY = process.env.ADMIN_ALGOLIA_API_KEY;
export const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
export const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

if (!ALGOLIA_APP_ID) throw Error("Please set Algolia App ID");

if (!ALGOLIA_API_KEY) throw Error("Please set Algolia API Key");

if (!ALGOLIA_INDEX_NAME) throw Error("Please set Algolia Index Name");

if (!GOOGLE_BOOKS_API_KEY) throw Error("Please set Google Books API Key");

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
    const googleBooksData = await getGoogleBooksData(
      book.isbn,
      GOOGLE_BOOKS_API_KEY
    );
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

export const updateAlgoliaIndex = async (algoliaData: AlgoliaEntry[]) => {
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

  const index = client.initIndex(ALGOLIA_INDEX_NAME);

  await updateAlgoliaObjects(index, algoliaData);

  await updateAlgoliaSettings(index);
};
