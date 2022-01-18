import algoliasearch, { SearchIndex } from 'algoliasearch';
import { Book, Course } from '@prisma/client';
import { prisma } from '../prisma-client/prismaClient.mjs';

enum EntryType {
    BOOK = 'book',
    COURSE = 'course',
}

interface AlgoliaEntry {
    type: EntryType;
    entry: Book | Course;
}

const searchableAttributes: string[] = [
    'entry.dept.abbreviation',
    'entry.dept.name',
    'entry.code',
    'entry.name',
    'entry.isbn',
];

const rankings: string[] = ['exact', 'words', 'proximity'];

export const getAlgoliaObject = async (): Promise<AlgoliaEntry[]> => {
    const dbBooks: Book[] = await prisma.book.findMany();

    const dbCourses: Course[] = await prisma.course.findMany({
        include: {
            dept: true,
        },
    });

    const algoliaBookEntries: AlgoliaEntry[] = dbBooks.map((book: Book) => {
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