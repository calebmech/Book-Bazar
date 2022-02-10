import type { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethod } from "@lib/http-method";
import { getCourseWithBooks } from "@lib/services/course";
import { StatusCodes } from "http-status-codes";
import { parseCourseCode } from '@lib/helpers/backend/parse-course-code';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getCourseWithBooksHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

async function getCourseWithBooksHandler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (Array.isArray(code)) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  const parsedCode = parseCourseCode(code as string)

  if (!parsedCode) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  const course = await getCourseWithBooks(parsedCode);

  if (!course) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  return res.status(StatusCodes.OK).json(course);
}