import type { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethod } from "@lib/http-method";
import { getPostsForCourse } from "@lib/services/course";
import { StatusCodes } from "http-status-codes";
import { isAuthenticated } from '@lib/helpers/backend/user-helpers';
import { parseCourseCode } from '@lib/helpers/backend/parse-course-code';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getPostsForCourseHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

async function getPostsForCourseHandler(req: NextApiRequest, res: NextApiResponse) {
  const { code, length, page } = req.query;

  if (Array.isArray(code) || Array.isArray(length) || Array.isArray(page)){
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  const parsedCode = parseCourseCode(code as string)

  if (!parsedCode) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  const lengthInt = length ? parseInt(length as string) : 20;
  const pageInt = page ? parseInt(page as string) : 0;
  const includeUser = await isAuthenticated(req, res);
  const posts = await getPostsForCourse(parsedCode, lengthInt, pageInt, includeUser);

  if (!posts) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }
  
  return res.status(StatusCodes.OK).json(posts);
}