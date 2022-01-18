import { CampusStoreEntry } from "./helpers/getTextbookInformation";
import { updateDatabase } from "./database/updateDatabase";
import { getBookData } from "./helpers/getBookData";
import { axiosRequest } from "./helpers/axiosRequest";
import {
  updateAlgoliaIndex,
  getAlgoliaObject,
} from "./algolia/updateAlgoliaIndex";
import fs from "fs/promises";

// Algolia constants - FILL BEFORE RUNNING
export const algoliaAppId: string = "";
export const algoliaApiKey: string = "";
export const algoliaIndexName: string = "";

// Variables used to build links that connect to campus store
const storeDomain = "https://campusstore.mcmaster.ca";
const storeBookPath = "/cgi-mcm/ws";
const storeCourseMaterialPath = "/txhome.pl?wsgm=coursematerial";

const indexTextbooks = async () => {
  const courseMaterialHTML: string = await axiosRequest(
    `${storeDomain}${storeBookPath}${storeCourseMaterialPath}`
  );

  const campusStoreData: CampusStoreEntry[] = await getBookData(
    courseMaterialHTML
  );

  let data = JSON.stringify(campusStoreData);
  await fs.writeFile("data.json", '{ "Data":' + data + "}");

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
