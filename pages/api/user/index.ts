import { getCurrentUser } from "@lib/helpers/backend/user-helpers";
import { ResponseObject } from "@lib/helpers/type-utilities";
import { HttpMethod } from "@lib/http-method";
import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getCurrentUserHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

export type GetCurrentUserResponse = ResponseObject<User>;

async function getCurrentUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getCurrentUser(req, res);

  if (!user) {
    return res.status(StatusCodes.NO_CONTENT).end();
  }

  return res.status(StatusCodes.OK).json(user);
}
