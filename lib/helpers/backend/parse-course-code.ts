export type CourseCode = {
  deptAbbreviation: string;
  code: string;
};

export function parseCourseCode(code: string): CourseCode | null {
  let match = /(\w+)-(\d\w\w\d)/.exec(code);
  if (match) {
    return {
      deptAbbreviation: match[1].toUpperCase(),
      code: match[2].toUpperCase(),
    };
  }
  return null;
}