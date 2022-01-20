// Parse variables from page to use eval
const varDefine = "var";
const arrayDefine = "new Array(";
const arrayEnd = ");";

// Checks if book store HTML contains expected content
export const doesStoreScriptContainExpectedContent = (
  variables: string
): boolean => {
  const variablesSplit = variables.split("\n");
  for (let c = 0; c < variablesSplit.length; c++) {
    const variableLine = variablesSplit[c].trim();

    if (
      variableLine === "" ||
      variablesSplit[c] === "\n" ||
      variablesSplit[c].startsWith("//")
    ) {
      continue;
    }
    const variableLineContent = variableLine.split("=");
    if (variableLineContent.length !== 2) return false;

    const contentStart = variableLineContent[0].trim().split(" ")[0];
    const isCorrectVarDefine = contentStart !== varDefine;
    if (isCorrectVarDefine) return false;

    const contentEnd = variableLineContent[1].trim();
    const isCorrectArrayStart = contentEnd.startsWith(arrayDefine);
    if (!isCorrectArrayStart) return false;

    const isCorrectArrayEnd = contentEnd.endsWith(arrayEnd);
    if (!isCorrectArrayEnd) return false;

    const arrayStrings = contentEnd.substring(10, contentEnd.length - 2);
    const splitArrayStrings = arrayStrings.split(",");
    for (let s = 0; s < splitArrayStrings.length; s++) {
      if (
        !(
          splitArrayStrings[s].startsWith('"') &&
          splitArrayStrings[s].endsWith('"')
        )
      ) {
        return false;
      }
    }
  }

  return true;
};
