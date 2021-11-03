/* Instructions:

1. Install Deno CLI: https://deno.land/manual/getting_started/installation
2. Run "deno run --allow-write --allow-net index.js"

*/

// Variables used to build links that connect to campus store
let storeDomain = 'https://campusstore.mcmaster.ca';
let storeBookPath = '/cgi-mcm/ws';
let storeCourseMaterialPath = '/txhome.pl?wsgm=coursematerial';
let storeFindBookPath = '/txsub.pl?';
let storeImagePath = "/getTradeImage.pl?isbn=";
let storeTermG1Search = 'wsTERMG1=';
let storeTermDescSearch = '&wsTERMDESC1=';
let storeDeptG1Search = '&wsDEPTG1=';
let storeDeptDescSearch = '&wsDEPTDESC1=';
let storeCourseG1Search = '&wsCOURSEG1=';
let storeSectionG1Search = '&wsSECTIONG1=';
let storeProgramG1Search = '&programG1=';
let storeFindBookPrefix = '&crit_cnt=1';

// Here is the path to generate the link to the book image
let bookImagePath = `${storeDomain}${storeBookPath}${storeImagePath}`

// Parse variables from page to use eval
let startStoreVariablesScrape = "/// Program/Terms";
let endStoreVariablesScrape = "</script>";
let varDefine = 'var';
let arrayDefine = "new Array(";
let arrayEnd = ");";

// Values to parse options from pages
let startParseProgram = "<option value=\"";
let endParseSlash = "\"";
let parseISBN = '?isbn=';
let parseBookName = 'alt="'

// HTTP error status codes
let HTTP_STATUS_CODES = {
    SUCCESS: 200,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
};

/* HTML text from campus store course material page
   https://campusstore.mcmaster.ca/cgi-mcm/ws/txhome.pl?wsgm=coursematerial
*/
let courseMaterialHTML = await makeFetchRequest(`${storeDomain}${storeBookPath}${storeCourseMaterialPath}`);


function isEvalSafe(variables) {
    let variablesSplit = variables.split("\n");
    for (let c = 0; c < variablesSplit.length; c++) {
        let variableLine = variablesSplit[c].trim();
        if (variableLine == '' || variablesSplit[c] == '\n' || variablesSplit[c].startsWith('\/\/'))
            continue;
        let variableLineContent = variableLine.split("=");

        if (variableLineContent.length != 2) return false;

        let contentStart = variableLineContent[0].trim().split(" ")[0];
        let isCorrectVarDefine = contentStart != varDefine;
        if (isCorrectVarDefine) return false;

        let contentEnd = variableLineContent[1].trim();
        let isCorrectArrayStart = contentEnd.startsWith(arrayDefine)
        if (!isCorrectArrayStart) return false;

        let isCorrectArrayEnd = contentEnd.endsWith(arrayEnd)
        if (!isCorrectArrayEnd) return false;

        let arrayStrings = contentEnd.substring(10, contentEnd.length - 2);
        let splitArrayStrings = arrayStrings.split();
        for (let s = 0; s < splitArrayStrings.length; s++) {
            if (!(splitArrayStrings[s].startsWith("\"") && splitArrayStrings[s].endsWith("\""))) return false;
        }
    }
    return true;
}

//Define variables from course website instead of defining those above
let courseMaterialVariables = courseMaterialHTML.substring(courseMaterialHTML.indexOf(startStoreVariablesScrape), courseMaterialHTML.length);
courseMaterialVariables = courseMaterialVariables.substring(courseMaterialVariables.indexOf("\n"), courseMaterialVariables.indexOf(endStoreVariablesScrape));
if (isEvalSafe(courseMaterialVariables)) {
    (0, eval)(courseMaterialVariables)
}


// Replace " " with "+" for find book link
function replaceSpace(input) {
    return input.replaceAll(" ", "+");
}

// Get program options based on raw HTML page content
function findProgramOptions(courseMaterialRAW) {
    let programOptions = [];
    let programOptionsRAW = courseMaterialRAW.split(startParseProgram);
    for (let p = 2; p < programOptionsRAW.length; p++) {
        let optionEnd = programOptionsRAW[p].indexOf(endParseSlash);
        let newProgram = programOptionsRAW[p].substring(0, optionEnd);
        if (!(newProgram == '')) programOptions.push(newProgram);
    }
    return programOptions;
}

// Create link used to find page for a user's selections
function createFindBookLink(program, term, dept, course, section) {
    let termG1 = replaceSpace(term.value); let termDesc = replaceSpace(term.text);
    let deptG1 = replaceSpace(dept.value); let deptDesc = replaceSpace(dept.value);
    let courseG1 = replaceSpace(course);
    let sectionG1 = replaceSpace(section);
    let programG1 = replaceSpace(program);
    return `${storeDomain}${storeBookPath}${storeFindBookPath}${storeTermG1Search}${termG1}${storeTermDescSearch}${termDesc}${storeDeptG1Search}${deptG1}${storeDeptDescSearch}${deptDesc}${storeCourseG1Search}${courseG1}${storeSectionG1Search}${sectionG1}${storeProgramG1Search}${programG1}${storeFindBookPrefix}`;
}

// Return textbook information given link and it's parameters
async function getTextbookInformation(link, program, term, dept, course, section) {
    var textbookInformation = [];
    var bookHTML = await makeFetchRequest(link);
    var bookSplit = bookHTML.split(parseISBN);
    for (let book = 1; book < bookSplit.length; book++) {
        let ISBN = bookSplit[book].substring(0, 13);
        if (JSON.stringify(textbookInformation).includes(ISBN)) {
            continue;
        }
        let bookName = bookSplit[book].substring(bookSplit[book].indexOf(parseBookName) + 5, bookSplit[book].length);
        bookName = bookName.substring(0, bookName.indexOf(endParseSlash));
        let bookImageURL = `${bookImagePath}${ISBN}`;
        let newBook = { "ISBN": ISBN, "Name": bookName, "Program": program, "Term": term, "Course": course, "Dept": dept, "Section": section, 'Image': bookImageURL };
        textbookInformation.push(newBook);
    }
    return textbookInformation;
}

// Get book data for a program
async function getProgramBookData(program) {
    let bookData = [];
    let terms = getNextMenu2(program, '', '', '', '');
    for (let t = 0; t < terms.length; t++) {
        let depts = getNextMenu2(program, terms[t].value, '', '', '');
        for (let d = 0; d < depts.length; d++) {
            let courses = getNextMenu2(program, terms[t].value, depts[d].value, '', '');
            for (let c = 0; c < courses.length; c++) {
                let sections = getNextMenu2(program, terms[t].value, depts[d].value, courses[c], '');
                for (let s = 0; s < sections.length; s++) {
                    let bookLink = createFindBookLink(program, terms[t], depts[d], courses[c], sections[s]);
                    let textbookInfo = await getTextbookInformation(bookLink, program, terms[t].text, depts[d].text, courses[c], sections[s]);
                    for (let bookNum = 0; bookNum < textbookInfo.length; bookNum++) {
                        bookData.push(textbookInfo[bookNum]);
                    }
                }
            }
        }
    }
    return bookData;
}

// Get all data in JSON format
async function getBookDataJSON(courseMaterialRAW) {
    let bookDataJSON = [];
    let bookPrograms = await findProgramOptions(courseMaterialRAW);
    for (let p = 0; p < bookPrograms.length; p++) {
        let programData = await getProgramBookData(bookPrograms[p]);
        for (let pD = 0; pD < programData.length; pD++) {
            bookDataJSON.push(programData[pD]);
        }
    }
    return bookDataJSON;
}

/* Get information for program, term, dept, etc.
   Based on getNextMenu2 in https://campusstore.mcmaster.ca/js/wsText.js
*/
function getNextMenu2(program, term, dept, course, sectionid) {
    //// This function is used to fill in Program/Term/Dept/Course and Section dropdowns on Textbook search page. The required Javascript arrays are created in Perl script - webstore_scripts.pm
    var dataarray = new Array();
    let termid = 'term'; let deptid = 'dept'; let courseid = 'course';
    var tval = ""; var menuid = "";
    if (program != "" && term == "") {
        program = program.replace(/\ /g, "");
        dataarray = eval(program);	// "eval(program) sets up the dataarray to actual array for program name
        menuid = termid;
    } else if (program != "" && term != "" && dept == "") {
        tval = program + term;
        tval = tval.replace(/\ /g, "");
        dataarray = eval(tval);
        menuid = deptid;
    } else if (program != "" && term != "" && dept != "" && course == "") {
        dept = dept.replace(/\&/g, "and");
        dept = dept.replace(/\-/g, "_");
        tval = program + term + dept;
        tval = tval.replace(/\ /g, "");
        dataarray = eval(tval);
        menuid = courseid;
    } else if (program != "" && term != "" && dept != "" && course != "") {
        dept = dept.replace(/\&/g, "and");
        dept = dept.replace(/\-/g, "_");
        course = course.replace(/[^a-zA-Z0-9]/, "");	/// To remove all non-alphanumeric characters
        tval = program + term + dept + course;
        tval = tval.replace(/\ /g, "");
        dataarray = eval(tval);
        menuid = sectionid;
    } else if (term != "" && dept == "") {
        tval = term;
        tval = tval.replace(/\ /g, "");
        dataarray = eval(tval);
        menuid = deptid;
    } else if (term != "" && dept != "" && course == "") {
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
}

/* Parse information for next menu items
   Based on listMenu2 in https://campusstore.mcmaster.ca/js/wsText.js
*/
function listMenu2(menu, menuid) {
    var inc = 0;
    menu.sort();
    var list = [];
    var Optn = {}
    var subarr = new Array();
    for (inc = 0; inc < menu.length; inc++) {
        if (menuid == 'term' || menuid == 'dept') {
            subarr = (menu[inc]).split("~");
            if (menuid == "dept") { subarr[0] = (subarr[0]).replace(/and/, "&"); }
            Optn.value = subarr[0];
            Optn.text = subarr[1];
            list.push(Optn);
        } else {
            if (menuid == "course") { menu[inc] = (menu[inc]).replace(/No/, "#"); }	// The # sign is not allowed in javascript array. - 20APR2015 - M Zahid
            if (menuid == "course") { menu[inc] = (menu[inc]).replace(/and/, "&"); }	// The & sign is not allowed in javascript array. - 21APR2015 - M Zahid
            list.push(menu[inc]);
        }
        var Optn = {};
    }

    return list;
}

// Make fetch request to get HTML text information
async function makeFetchRequest(endpoint, options, milliInterval, maxRetry) {
    maxRetry = maxRetry || 5;
    milliInterval = milliInterval || 1000;
    options = options || {};
    return new Promise(function (resolve, reject) {
        function fetchData(maxRetry) {
            fetch(endpoint, options).then(function (res) {
                if (res.status === HTTP_STATUS_CODES.SUCCESS) {
                    res.text().then(text => resolve(text)).catch(() => resolve({}));
                } else if (maxRetry !== 1 && (res.status >= HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR || res.status === HTTP_STATUS_CODES.TOO_MANY_REQUESTS)) {
                    setTimeout(function () {
                        fetchData(--maxRetry);
                    }, milliInterval);
                } else {
                    reject(res);
                }
            }).catch(function (e) {
                reject(e);
            });
        }
        fetchData(maxRetry);
    });
}

// Get book data JSON
let bookDataJSONResult = await getBookDataJSON(courseMaterialHTML);


// Write to a JSON file
await Deno.writeTextFile("./books.json", "{ \"Books\": " + JSON.stringify(bookDataJSONResult) + "}");
console.log("File written to books.json");