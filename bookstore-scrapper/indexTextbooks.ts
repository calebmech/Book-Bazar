import { CampusStoreEntry } from "./helpers/getTextbookInformation";
import { updateDatabase } from "./database/updateDatabase";
import { getBookData } from "./helpers/getBookData";
import { axiosRequest } from "./helpers/axiosRequest";
import {
  updateAlgoliaIndex,
  getAlgoliaObject,
} from "./algolia/updateAlgoliaIndex";
import fs from "fs/promises";

// If node env is not provided in command line, default to values in env.development
if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
require("dotenv").config({ path: `../.env.${process.env.NODE_ENV}` });

export const algoliaAppId = process.env.ALGOLIA_APP_ID;
export const algoliaApiKey = process.env.ALGOLIA_API_KEY;
export const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME;

if (!algoliaAppId || !algoliaApiKey || !algoliaIndexName)
  throw Error("Please set Algolia environment variables");

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

  await updateDatabase(campusStoreData);

  const algoliaObject = await getAlgoliaObject();

  await updateAlgoliaIndex(
    algoliaAppId,
    algoliaApiKey,
    algoliaIndexName,
    algoliaObject
  );
};

indexTextbooks();
