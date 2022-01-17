import algoliasearch, { SearchIndex } from 'algoliasearch';
import { Book, Course, Dept } from '@prisma/client';
import { prisma } from '../prisma-client/prismaClient.mjs';

const bookType: string = 'book';
const courseType: string = 'course';

interface AlgoliaData {
    id: string;
    name: string;
    isbn?: string;
    imageUrl?: string;
    code?: string;
    deptName?: string;
    deptAbv?: string;
}

interface AlgoliaEntry {
    type: string;
    data: AlgoliaData;
}

const searchableAttributes: string[] = [
    'data.deptAbv',
    'data.deptName',
    'data.code',
    'data.name',
    'data.isbn',
];

const rankings: string[] = ['exact', 'words', 'proximity'];

export const getAlgoliaObject = async () => {
    const dbBooks: Book[] = await prisma.book.findMany();

    const dbCourses: Course[] = await prisma.course.findMany();

    const dbDepts: Dept[] = await prisma.dept.findMany();

    const algoliaBooks: AlgoliaEntry[] = dbBooks.map((book) => {
        const information: AlgoliaEntry = {
            type: bookType,
            data: {
                id: book.id,
                isbn: book.isbn,
                name: book.name,
                imageUrl: book.imageUrl,
            },
        };
        return information;
    });

    const algoliaCourses: AlgoliaEntry[] = dbCourses.map((course) => {
        const dept = dbDepts.filter((dept) => dept.id === course.deptId)[0];
        const information: AlgoliaEntry = {
            type: courseType,
            data: {
                id: course.id,
                code: course.code,
                name: course.name,
                deptName: dept.name,
                deptAbv: dept.abbreviation,
            },
        };
        return information;
    });

    return algoliaBooks.concat(algoliaCourses);
};

const updateAlgoliaObjects = async (
    index: SearchIndex,
    data: AlgoliaEntry[]
) => {
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
