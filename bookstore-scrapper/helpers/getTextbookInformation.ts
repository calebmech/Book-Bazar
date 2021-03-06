// Return textbook information given link and it's parameters
import { axiosRequest } from "./axiosRequest";
import { v4 } from "uuid";
import { Dept, Course, Book } from "@prisma/client";

// Variables used to build links that connect to campus store
const storeDomain = "https://campusstore.mcmaster.ca";
const storeBookPath = "/cgi-mcm/ws";
const storeImagePath = "/getTradeImage.pl?isbn=";

// Here is the path to generate the link to the book image
const bookImagePath = `${storeDomain}${storeBookPath}${storeImagePath}`;

// Values to parse options from pages
const endParseSlash = '"';
const parseISBN = "?isbn=";
const parseEndBookHTML = "Additional Supplies Recommended for this Course";
const parseBookName = 'alt="';

const endCourseParseOne = "  opens a new window";
const endCourseParseTwo = "</a><span";

// Values to parse price from book page
const startParsePrice = 'value="';
const midParsePrice = '" onclick="toggle';
const endParsePrice = "new";
const quoteParsePrice = "'";
const notAvailable = null;

export interface CampusStoreEntry {
  book: Book;
  course: Course;
  dept: Dept;
}

export const getTextbookInformation = async (
  link: string,
  term: string,
  dept: string,
  course: string,
  courseNameHTML: string
): Promise<CampusStoreEntry[]> => {
  // Array to return
  const campusStoreEntries: CampusStoreEntry[] = [];

  // Get HTML source code of page
  let bookHTML: string = (await axiosRequest(link)) as string;

  // Check if page has additonal recommended supplies
  const suppliesIndex: number = bookHTML.indexOf(parseEndBookHTML);
  if (suppliesIndex > 0) bookHTML = bookHTML.substring(0, suppliesIndex);

  // Split the different books on the page into parts of an array
  let bookSplit = bookHTML.split(parseISBN);

  // Find out the department
  const deptSplit = dept.split("-");
  let deptName = "";
  const deptAbv = deptSplit[0].trim();
  if (deptSplit.length === 1) {
    deptName = deptAbv;
  } else {
    deptName = deptSplit[1].trim();
  }
  const deptData: Dept = {
    id: v4(),
    name: deptName,
    abbreviation: deptAbv,
  };

  // Find out the course
  const courseName = await getCourseName(deptAbv, course, courseNameHTML);
  const courseData: Course = {
    id: v4(),
    name: courseName,
    code: course,
    term: term,
    deptId: deptData.id,
  };

  // Create the book data object for each book
  for (let book = 1; book < bookSplit.length; book++) {
    const isbn = bookSplit[book].substring(0, 13);

    const campusStorePrice = getBookPrice(bookHTML, isbn);

    if (JSON.stringify(campusStoreEntries).includes(isbn)) {
      continue;
    }

    let name = bookSplit[book].substring(
      bookSplit[book].indexOf(parseBookName) + 5,
      bookSplit[book].length
    );
    name = name.substring(0, name.indexOf(endParseSlash));

    const imageUrl = `${bookImagePath}${isbn}`;

    const bookData: Book = {
      id: v4(),
      isbn,
      name,
      imageUrl,
      isCampusStoreBook: true,
      campusStorePrice,
    };

    const campusStoreEntry: CampusStoreEntry = {
      book: bookData,
      course: courseData,
      dept: deptData,
    };

    campusStoreEntries.push(campusStoreEntry);
  }
  return campusStoreEntries;
};

const getCourseName = async (
  dept: string,
  code: string,
  courseNameHTML: String
) => {
  const startParseCourseName = `${dept} ${code} - `;
  const startParseIndex: number = courseNameHTML.indexOf(startParseCourseName);

  if (startParseIndex < 0) return notAvailable;

  let courseName: string = courseNameHTML.substring(
    startParseIndex + startParseCourseName.length
  );

  const endParseIndexOne: number = courseName.indexOf(endCourseParseOne);
  courseName = courseName.substring(0, endParseIndexOne);

  const endParseIndexTwo: number = courseName.indexOf(endCourseParseTwo);
  courseName = courseName.substring(0, endParseIndexTwo) || courseName;

  return courseName || notAvailable;
};

const getBookPrice = (bookHTML: string, ISBN: string): number | null => {
  const priceStringArray = bookHTML.split(
    `${startParsePrice}${ISBN}${midParsePrice}`
  );
  if (priceStringArray.length === 1) return notAvailable;

  let priceString = priceStringArray[1].split(endParsePrice)[1];
  priceString = priceString.substring(4, priceString.length);
  priceString = priceString.substring(0, priceString.indexOf(quoteParsePrice));

  if (priceString === "0.00" || priceString === "") {
    return notAvailable;
  }

  priceString = priceString.replace(".", "");

  return parseInt(priceString);
};
