// Get all data in JSON format
import { CampusStoreEntry } from './getTextbookInformation.mjs';
import { getNextMenu2, getBookLink } from './campusStoreFunctions.mjs';
import { getTextbookInformation } from './getTextbookInformation.mjs';

// Values to parse options from pages
const startParseProgram = '<option value="';
const endParseSlash = '"';

export const getBookData = async (
    courseMaterialRAW: string
): Promise<CampusStoreEntry[]> => {
    const bookData = [];
    const bookPrograms = await getProgramOptions(courseMaterialRAW);
    for (let p = 0; p < bookPrograms.length; p++) {
        const programData = await getProgramBookData(bookPrograms[p]);
        for (let pD = 0; pD < programData.length; pD++) {
            bookData.push(programData[pD]);
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

        if (!(newProgram === '')) programOptions.push(newProgram);
    }
    return programOptions;
};

// Get book data for a program
const getProgramBookData = async (program: string) => {
    const bookData = [];
    const terms = getNextMenu2(program, '', '', '', '');
    for (let t = 0; t < terms.length; t++) {
        const depts = getNextMenu2(program, terms[t].value, '', '', '');
        for (let d = 0; d < depts.length; d++) {
            const courses = getNextMenu2(
                program,
                terms[t].value,
                depts[d].value,
                '',
                ''
            );
            for (let c = 0; c < courses.length; c++) {
                const sections = getNextMenu2(
                    program,
                    terms[t].value,
                    depts[d].value,
                    courses[c],
                    ''
                );
                for (let s = 0; s < sections.length; s++) {
                    const bookLink = getBookLink(
                        program,
                        terms[t],
                        depts[d],
                        courses[c],
                        sections[s]
                    );
                    const textbookInfo = await getTextbookInformation(
                        bookLink,
                        program,
                        terms[t].text,
                        depts[d].text,
                        courses[c]
                    );
                    for (
                        let bookNum = 0;
                        bookNum < textbookInfo.length;
                        bookNum++
                    ) {
                        bookData.push(textbookInfo[bookNum]);
                    }
                }
            }
        }
    }
    return bookData;
};
