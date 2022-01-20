import {
  getCurrentUser,
  isAuthenticated,
} from "@lib/helpers/backend/user-helpers";
import {
  deleteUser,
  getUserWithPosts,
  ModifiableUser,
  updateUser,
} from "@lib/services/user";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const uploadHandler = multer({
  storage: multer.memoryStorage(),
});

const handler = nc<NextApiRequest, NextApiResponse>({})
  .get(getUserHandler)
  .delete(deleteUserHandler)
  .use(uploadHandler.single("image"))
  .put(updateUserHandler);

export default handler;

export const config = {
  api: { bodyParser: false },
};

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

export type UpdateUserRequest = Omit<ModifiableUser, "image">;

function instanceOfModifiableUser(
  object: ModifiableUser
): object is ModifiableUser {
  return (
    typeof object === "object" &&
    (Boolean(object.image) || typeof object.name === "string")
  );
}

interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

async function updateUserHandler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  const authenticatedUser = await getCurrentUser(req, res);

  if (!authenticatedUser) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  const { id } = req.query;
  const userUpdate = {
    ...req.body,
    image: req.file?.buffer,
  };

  if (Array.isArray(id) || !instanceOfModifiableUser(userUpdate)) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  if (id !== authenticatedUser.id) {
    return res.status(StatusCodes.FORBIDDEN).end();
  }

  // Don't need to check if user exists because only
  // the currently authenticated user can be updated
  const updatedUser = await updateUser(id, userUpdate);

  return res.status(StatusCodes.OK).json(updatedUser);
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
