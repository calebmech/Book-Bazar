export type CourseCode = {
  deptAbbreviation: string;
  code: string;
};

export function parseCourseCode(code: string): CourseCode | null {
  const parts = code.split("-");
  if (parts.length === 2) {
    return {
      deptAbbreviation: parts[0].toUpperCase(),
      code: parts[1].toUpperCase(),
    };
  }
  return null;
}
