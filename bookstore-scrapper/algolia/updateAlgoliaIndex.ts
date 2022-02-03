import algoliasearch, { SearchIndex } from "algoliasearch";
import { Book, Course } from "@prisma/client";
import { prisma } from "../prisma-client/prismaClient";

enum EntryType {
  BOOK = "book",
  COURSE = "course",
}

interface AlgoliaEntry {
  type: EntryType;
  entry: Book | Course;
}

enum UNWANTED_ENTRY_KEYWORD {
  UNWANTED_ISBN_ENDING = "B",
  ETEXT = "ETEXT",
  LAB_MANUAL = "LAB MANUAL",
}

const searchableAttributes: string[] = [
  "entry.dept.abbreviation",
  "entry.dept.name",
  "entry.code",
  "entry.name",
  "entry.isbn",
];

const rankings: string[] = [
  "asc(entry.code)",
  "asc(entry.dept.abbreviation)",
  "asc(entry.dept.name)",
  "attribute",
  "typo",
  "words",
  "proximity",
  "exact",
  "custom",
];

export const getAlgoliaObject = async (): Promise<AlgoliaEntry[]> => {
  const dbBooks: Book[] = await prisma.book.findMany();

  const dbCourses: Course[] = await prisma.course.findMany({
    include: {
      dept: true,
    },
  });

  const algoliaBookEntries: AlgoliaEntry[] = dbBooks
    .filter((book) => {
      return (
        /* Remove campus store entries that are not related to physical books
        or provide a note to users. */
        !(
          book.isbn.endsWith(UNWANTED_ENTRY_KEYWORD.UNWANTED_ISBN_ENDING) ||
          book.name.startsWith(UNWANTED_ENTRY_KEYWORD.ETEXT) ||
          book.name.includes(UNWANTED_ENTRY_KEYWORD.LAB_MANUAL)
        )
      );
    })
    .map((book: Book) => {
      const algoliaBookEntry: AlgoliaEntry = {
        type: EntryType.BOOK,
        entry: book,
      };
      return algoliaBookEntry;
    });

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
