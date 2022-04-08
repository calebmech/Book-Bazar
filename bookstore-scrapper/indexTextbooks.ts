import { CampusStoreEntry } from "./helpers/getTextbookInformation";
import { updateDatabase } from "./database/updateDatabase";
import { getBookData } from "./helpers/getBookData";
import { axiosRequest } from "./helpers/axiosRequest";
import {
  updateAlgoliaIndex,
  getAlgoliaObject,
} from "./algolia/updateAlgoliaIndex";
import fs from "fs/promises";

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

  console.log("Finished scrapping process");

  let data = JSON.stringify(campusStoreData);
  await fs.writeFile("bookstore-scrapper/data.json", '{ "Data":' + data + "}");

  console.log("Written to JSON");

  await updateDatabase(campusStoreData);

  console.log("Updated database");

  const algoliaObject = await getAlgoliaObject();

  await updateAlgoliaIndex(algoliaObject);

  console.log("Updated Algolia");
};

indexTextbooks();
