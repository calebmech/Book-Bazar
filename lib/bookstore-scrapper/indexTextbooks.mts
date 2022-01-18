/*
    Run:
    tsc --downlevelIteration --target es2021 --moduleResolution node --module es2022 --allowSyntheticDefaultImports indexTextbooks.mts; 
    NODE_TLS_REJECT_UNAUTHORIZED='0' node indexTextbooks.mjs
*/

import { CampusStoreEntry } from './helpers/getTextbookInformation.mjs';
import { updateDatabase } from './database/updateDatabase.mjs';
import { getBookData } from './helpers/getBookData.mjs';
import { axiosRequest } from './helpers/axiosRequest.mjs';
import {
    updateAlgoliaIndex,
    getAlgoliaObject,
} from './algolia/updateAlgoliaIndex.mjs';
import fs from 'fs/promises';

// Algolia constants - FILL BEFORE RUNNING
export const algoliaAppId: string = '';
export const algoliaApiKey: string = '';
export const algoliaIndexName: string = '';

// Variables used to build links that connect to campus store
const storeDomain = 'https://campusstore.mcmaster.ca';
const storeBookPath = '/cgi-mcm/ws';
const storeCourseMaterialPath = '/txhome.pl?wsgm=coursematerial';

const indexTextbooks = async () => {
    const courseMaterialHTML: string = await axiosRequest(
        `${storeDomain}${storeBookPath}${storeCourseMaterialPath}`
    );

    const campusStoreData: CampusStoreEntry[] = await getBookData(
        courseMaterialHTML
    );

    let data = JSON.stringify(campusStoreData);
    await fs.writeFile('data.json', '{ "Data":' + data + '}');

    const databaseUpdate = await updateDatabase(campusStoreData);

    const algoliaObject = await getAlgoliaObject();

    const algoliaIndexUpdate = await updateAlgoliaIndex(
        algoliaAppId,
        algoliaApiKey,
        algoliaIndexName,
        algoliaObject
    );
};

indexTextbooks();
