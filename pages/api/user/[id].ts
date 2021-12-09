import {
  getCurrentUser,
  isAuthenticated,
} from "@lib/helpers/backend/get-current-user";
import { HttpMethod } from "@lib/http-method";
import {
  deleteUser,
  getUserWithPosts,
  ModifiableUser,
  updateUser,
} from "@lib/services/user";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.GET:
      return getUserHandler(req, res);
    case HttpMethod.PUT:
      return updateUserHandler(req, res);
    case HttpMethod.DELETE:
      return deleteUserHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

async function getUserHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAuthenticated(req, res))) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  const { id } = req.query;

  if (Array.isArray(id)) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  const user = await getUserWithPosts(id);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  return res.status(StatusCodes.OK).json(user);
}

export type UpdateUserRequest = ModifiableUser;

function instanceOfUpdateUserRequest(
  object: UpdateUserRequest
): object is UpdateUserRequest {
  return (
    typeof object === "object" &&
    (typeof object.imageUrl === "string" || typeof object.name === "string")
  );
}

async function updateUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const authenticatedUser = await getCurrentUser(req, res);

  if (!authenticatedUser) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  const { id } = req.query;
  const userUpdate = req.body;

  if (Array.isArray(id) || !instanceOfUpdateUserRequest(userUpdate)) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  if (id !== authenticatedUser.id) {
    return res.status(StatusCodes.FORBIDDEN).end();
  }

  // Don't need to check if user exists because only
  // the currently authenticated user can be updated
  const updatedUser = await updateUser(id, userUpdate);

  return res.status(StatusCodes.OK).send(updatedUser);
}

async function deleteUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const authenticatedUser = await getCurrentUser(req, res);

  if (!authenticatedUser) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  const { id } = req.query;

  if (Array.isArray(id)) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  if (id !== authenticatedUser.id) {
    return res.status(StatusCodes.FORBIDDEN).end();
  }

  // Don't need to check if user exists because only
  // the currently authenticated user can be deleted
  await deleteUser(id);

  return res.status(StatusCodes.OK).end();
}
