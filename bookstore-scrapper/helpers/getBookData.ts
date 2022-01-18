// Get all data in JSON format
import { CampusStoreEntry } from "./getTextbookInformation";
import {
  getNextMenu2,
  getBookLink,
  evaluateCourseMaterialVariables,
} from "./campusStoreFunctions";
import { getTextbookInformation } from "./getTextbookInformation";
import { axiosRequest } from "./axiosRequest";
import https from "https";

// Values to parse options from pages
const startParseProgram = '<option value="';
const endParseSlash = '"';

// Path to Course Name
const startCourseNamePath =
  "https://academiccalendars.romcmaster.ca/content.php?catoid=44&catoid=44&navoid=9045&filter%5B27%5D=&filter%5B29%5D=&filter%5Bcourse_type%5D=&filter%5Bkeyword%5D=&filter%5B32%5D=1&filter%5Bcpage%5D=";
const endCourseNamePath =
  "&filter%5Bexact_match%5D=1&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1#acalog_template_course_filter";
const finalPageText = "Other Courses";

export const getBookData = async (
  courseMaterialRAW: string
): Promise<CampusStoreEntry[]> => {
  const bookData = [];
  const bookPrograms = await getProgramOptions(courseMaterialRAW);
  const courseNameHTML = await getCourseNameHTML();
  await evaluateCourseMaterialVariables();
  for (const program of bookPrograms) {
    const programData = await getProgramBookData(program, courseNameHTML);
    for (const data of programData) {
      bookData.push(data);
    }
  }
  return bookData;
};

// Get program options based on raw HTML page content
const getProgramOptions = async (courseMaterialHTML: string) => {
  const programOptions = [];
  const programOptionsRAW = courseMaterialHTML.split(startParseProgram);
  for (let p = 2; p < programOptionsRAW.length; p++) {
    const optionEnd = programOptionsRAW[p].indexOf(endParseSlash);
    const newProgram = programOptionsRAW[p].substring(0, optionEnd);

    if (!(newProgram === "")) programOptions.push(newProgram);
  }
  return programOptions;
};

const getCourseNameHTML = async (): Promise<string> => {
  let page = 1;
  let courseNameHTML = "";

  // Custom agent used for Academic Calendar website - root certificate not recognized
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  while (!courseNameHTML.includes(finalPageText)) {
    const courseNamePageHTML = (await axiosRequest(
      `${startCourseNamePath}${page}${endCourseNamePath}`,
      { httpsAgent: agent }
    )) as string;
    courseNameHTML = courseNameHTML.concat(courseNamePageHTML);
    page += 1;
  }
  return courseNameHTML;
};

// Get book data for a program
const getProgramBookData = async (program: string, courseNameHTML: string) => {
  const bookData = [];
  const terms = getNextMenu2(program, "", "", "", "");
  for (const term of terms) {
    const depts = getNextMenu2(program, term.value, "", "", "");
    for (const dept of depts) {
      const courses = getNextMenu2(program, term.value, dept.value, "", "");
      for (const course of courses) {
        const sections = getNextMenu2(
          program,
          term.value,
          dept.value,
          course,
          ""
        );
        for (const section of sections) {
          const bookLink = getBookLink(program, term, dept, course, section);
          const textbookInfo = await getTextbookInformation(
            bookLink,
            term.text,
            dept.text,
            course,
            courseNameHTML
          );
          for (const info of textbookInfo) {
            bookData.push(info);
          }
        }
      }
    }
  }
  return bookData;
};
