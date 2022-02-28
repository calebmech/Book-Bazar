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

export const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
export const algoliaApiKey = process.env.ADMIN_ALGOLIA_API_KEY;
export const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

if (!algoliaAppId || !algoliaApiKey || !algoliaIndexName)
  throw Error("Please set Algolia environment variables");

// Variables used to build links that connect to campus store
const storeDomain = "https://campusstore.mcmaster.ca";
const storeBookPath = "/cgi-mcm/ws";
const storeCourseMaterialPath = "/txhome.pl?wsgm=coursematerial";

export enum UNWANTED_ENTRY_KEYWORD {
  ISBN_ENDING_WITH_B = "B",
  ETEXT = "ETEXT",
  LAB_MANUAL = "LAB MANUAL",
}

const isWantedEntry = (entry: CampusStoreEntry): boolean => {
  return !(
    entry.book.isbn.endsWith(UNWANTED_ENTRY_KEYWORD.ISBN_ENDING_WITH_B) ||
    entry.book.name.startsWith(UNWANTED_ENTRY_KEYWORD.ETEXT) ||
    entry.book.name.includes(UNWANTED_ENTRY_KEYWORD.LAB_MANUAL)
  );
};

const indexTextbooks = async () => {
  const courseMaterialHTML: string = await axiosRequest(
    `${storeDomain}${storeBookPath}${storeCourseMaterialPath}`
  );

  const campusStoreData: CampusStoreEntry[] = await getBookData(
    courseMaterialHTML
  ).then((data) => data.filter((entry) => isWantedEntry(entry)));

  console.log("Finished scrapping process");

  let data = JSON.stringify(campusStoreData);
  await fs.writeFile("bookstore-scrapper/data.json", '{ "Data":' + data + "}");

  console.log("Written to JSON");

  await updateDatabase(campusStoreData);

  console.log("Updated database");

  const algoliaObject = await getAlgoliaObject();

  await updateAlgoliaIndex(
    algoliaAppId,
    algoliaApiKey,
    algoliaIndexName,
    algoliaObject
  );
  console.log("Updated Algolia");
};

indexTextbooks();
