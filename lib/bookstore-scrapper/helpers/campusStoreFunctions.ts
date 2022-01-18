import { axiosRequest } from "./axiosRequest";
import { doesStoreScriptContainExpectedContent } from "./doesStoreScriptContainExpectedContent";

// Variables used to build links that connect to campus store
const storeDomain = "https://campusstore.mcmaster.ca";
const storeBookPath = "/cgi-mcm/ws";
const storeCourseMaterialPath = "/txhome.pl?wsgm=coursematerial";
const storeFindBookPath = "/txsub.pl?";
const storeTermG1Search = "wsTERMG1=";
const storeTermDescSearch = "&wsTERMDESC1=";
const storeDeptG1Search = "&wsDEPTG1=";
const storeDeptDescSearch = "&wsDEPTDESC1=";
const storeCourseG1Search = "&wsCOURSEG1=";
const storeSectionG1Search = "&wsSECTIONG1=";
const storeProgramG1Search = "&programG1=";
const storeFindBookPrefix = "&crit_cnt=1";

// Parse variables from page to use eval
const startStoreVariablesScrape = "/// Program/Terms";
const endStoreVariablesScrape = "</script>";

interface ValueText {
  value: string;
  text: string;
}

export async function evaluateCourseMaterialVariables() {
  const courseMaterialHTML = await axiosRequest(
    `${storeDomain}${storeBookPath}${storeCourseMaterialPath}`
  );

  // Define variables from course website instead of defining those above
  const courseMaterialVariables =
    getCourseMaterialVariables(courseMaterialHTML);

  if (!doesStoreScriptContainExpectedContent(courseMaterialVariables)) {
    throw new Error("Eval is not safe to run");
  } else {
    // eslint-disable-next-line no-eval
    (0, eval)(courseMaterialVariables);
  }
}

/* Get information for program, term, dept, etc.
   Based on getNextMenu2 in https://campusstore.mcmaster.ca/js/wsText.js
   PLEASE DO NOT CHANGE
*/

function getCourseMaterialVariables(courseMaterialHTML: string) {
  const courseMaterialVariables = courseMaterialHTML.substring(
    courseMaterialHTML.indexOf(startStoreVariablesScrape),
    courseMaterialHTML.length
  );
  return courseMaterialVariables.substring(
    courseMaterialVariables.indexOf("\n"),
    courseMaterialVariables.indexOf(endStoreVariablesScrape)
  );
}

export const getBookLink = (
  program: string,
  term: ValueText,
  dept: ValueText,
  course: string,
  section: string
) => {
  const replaceSpace = (input: string): string => {
    return input.replace(/ /g, "+");
  };
  const termG1 = replaceSpace(term.value);
  const termDesc = replaceSpace(term.text);
  const deptG1 = replaceSpace(dept.value);
  const deptDesc = replaceSpace(dept.value);
  const courseG1 = replaceSpace(course);
  const sectionG1 = replaceSpace(section);
  const programG1 = replaceSpace(program);
  return `${storeDomain}${storeBookPath}${storeFindBookPath}${storeTermG1Search}${termG1}${storeTermDescSearch}${termDesc}${storeDeptG1Search}${deptG1}${storeDeptDescSearch}${deptDesc}${storeCourseG1Search}${courseG1}${storeSectionG1Search}${sectionG1}${storeProgramG1Search}${programG1}${storeFindBookPrefix}`;
};

export const getNextMenu2 = (
  program: string,
  term: string,
  dept: string,
  course: string,
  sectionid: string
) => {
  /// / This function is used to fill in Program/Term/Dept/Course and Section dropdowns on Textbook search page. The required Javascript arrays are created in Perl script - webstore_scripts.pm
  // eslint-disable-next-line no-array-constructor
  let dataarray = [];
  const termid = "term";
  const deptid = "dept";
  const courseid = "course";
  let tval = "";
  let menuid = "";
  if (program !== "" && term === "") {
    program = program.replace(/\ /g, "");
    dataarray = eval(program); // "eval(program) sets up the dataarray to actual array for program name
    menuid = termid;
  } else if (program !== "" && term !== "" && dept === "") {
    tval = program + term;
    tval = tval.replace(/\ /g, "");
    dataarray = eval(tval);
    menuid = deptid;
  } else if (program !== "" && term !== "" && dept !== "" && course === "") {
    dept = dept.replace(/\&/g, "and");
    dept = dept.replace(/\-/g, "_");
    tval = program + term + dept;
    tval = tval.replace(/\ /g, "");
    dataarray = eval(tval);
    menuid = courseid;
  } else if (program !== "" && term !== "" && dept !== "" && course !== "") {
    dept = dept.replace(/\&/g, "and");
    dept = dept.replace(/\-/g, "_");
    course = course.replace(/[^a-zA-Z0-9]/, ""); /// To remove all non-alphanumeric characters
    tval = program + term + dept + course;
    tval = tval.replace(/\ /g, "");
    dataarray = eval(tval);
    menuid = sectionid;
  } else if (term !== "" && dept === "") {
    tval = term;
    tval = tval.replace(/\ /g, "");
    dataarray = eval(tval);
    menuid = deptid;
  } else if (term !== "" && dept !== "" && course === "") {
    dept = dept.replace(/\ /g, "");
    dataarray = eval(dept);
    menuid = courseid;
  } else {
    tval = dept + course;
    tval = tval.replace(/\ /g, "");
    dataarray = eval(tval);
    menuid = sectionid;
  }
  // The array name can't have '&', '/' and '-'. That is why these characters have been replaced above.
  return listMenu2(dataarray, menuid);
};

/* Parse information for next menu items
   Based on listMenu2 in https://campusstore.mcmaster.ca/js/wsText.js
   PLEASE DO NOT CHANGE
*/
const listMenu2 = (menu: string[], menuid: string) => {
  menu.sort();
  const list: any[] = [];
  let Optn: ValueText = { value: "", text: "" };
  // eslint-disable-next-line no-array-constructor
  let subarr = [];
  for (let inc = 0; inc < menu.length; inc++) {
    if (menuid === "term" || menuid === "dept") {
      subarr = menu[inc].split("~");
      if (menuid === "dept") {
        subarr[0] = subarr[0].replace(/and/, "&");
      }
      Optn.value = subarr[0];
      Optn.text = subarr[1];
      list.push(Optn);
    } else {
      if (menuid === "course") {
        menu[inc] = menu[inc].replace(/No/, "#");
      } // The # sign is not allowed in javascript array. - 20APR2015 - M Zahid
      if (menuid === "course") {
        menu[inc] = menu[inc].replace(/and/, "&");
      } // The & sign is not allowed in javascript array. - 21APR2015 - M Zahid
      list.push(menu[inc]);
    }
    Optn = { value: "", text: "" };
  }

  return list;
};
