import { paginate } from "@lib/helpers/backend/paginate";
import { prisma } from "@lib/services/db";
import {
  getSearchParamsFromQuery,
  isAlmostSubstring,
  SearchParams,
} from "@lib/services/search";
import { Course } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import leven from "leven";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const searchParams = getSearchParamsFromQuery(req.query);
    try {
      const searchResults = await getSearchResults(searchParams);
      res.status(StatusCodes.OK).json(searchResults);
    } catch (e) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`error finding search results: ${e}`);
    }
  } catch {
    res.status(StatusCodes.BAD_REQUEST).send("invalid search parameters");
  }
}

async function getSearchResults(searchParams: SearchParams) {
  let courses = await prisma.course.findMany();
  courses = await filterCourses(courses, searchParams.searchText);
  if ((searchParams.page - 1) * searchParams.pageLength > courses.length) {
    return [];
  }
  courses = await orderCourses(courses, searchParams.searchText);
  courses = paginate(courses, searchParams.pageLength, searchParams.page);
  return courses;
}

async function filterCourses(
  courses: Course[],
  searchText: string
): Promise<Course[]> {
  return courses.filter((course: Course) => {
    return (
      isAlmostSubstring(searchText, course.name) ||
      isAlmostSubstring(searchText, course.code)
    );
  });
}

async function orderCourses(
  courses: Course[],
  searchText: string
): Promise<Course[]> {
  return courses.sort(
    (courseA: Course, courseB: Course) =>
      leven(searchText, courseA.name) - leven(searchText, courseB.name)
  );
}
