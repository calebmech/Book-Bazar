// Get all data in JSON format
import { CampusStoreEntry } from "./getTextbookInformation";
import {
  getNextMenu2,
  getBookLink,
  evaluateCourseMaterialVariables,
} from "./campusStoreFunctions";
import { getTextbookInformation } from "./getTextbookInformation";

// Values to parse options from pages
const startParseProgram = '<option value="';
const endParseSlash = '"';

export const getBookData = async (
  courseMaterialRAW: string
): Promise<CampusStoreEntry[]> => {
  const bookData = [];
  const bookPrograms = await getProgramOptions(courseMaterialRAW);
  await evaluateCourseMaterialVariables();
  for (const program of bookPrograms) {
    const programData = await getProgramBookData(program);
    for (const data of programData) {
      bookData.push(data);
    }
  }
  return bookData;
};

// Get program options based on raw HTML page content
const getProgramOptions = async (courseMaterialRAW: string) => {
  const programOptions = [];
  const programOptionsRAW = courseMaterialRAW.split(startParseProgram);
  for (let p = 2; p < programOptionsRAW.length; p++) {
    const optionEnd = programOptionsRAW[p].indexOf(endParseSlash);
    const newProgram = programOptionsRAW[p].substring(0, optionEnd);

    if (!(newProgram === "")) programOptions.push(newProgram);
  }
  return programOptions;
};

// Get book data for a program
const getProgramBookData = async (program: string) => {
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
            program,
            term.text,
            dept.text,
            course
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
