import {
  getCurrentUser,
  isAuthenticated,
} from "@lib/helpers/backend/user-helpers";
import { getIntStringPriceAsNumber } from "@lib/helpers/priceHelpers";
import {
  deletePost,
  getPost,
  PostWithBook,
  PostWithBookWithUser,
  UpdatablePost,
  updatePost,
} from "@lib/services/post";
import { Post, PostStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { validate } from "uuid";

const uploadManager = multer({
  storage: multer.memoryStorage(),
});
// needed for multer+next-connect to work properly
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc<NextApiRequest, NextApiResponse>({})
  .get(getHandler)
  .delete(deleteHandler)
  .use(uploadManager.single("image"))
  .put(putHandler);

export default handler;

interface NextApiRequestWithPostId extends NextApiRequest {
  postId: string;
}

interface NextApiRequestWithPostIdAndImage extends NextApiRequestWithPostId {
  file?: Express.Multer.File;
}

async function getHandler(
  req: NextApiRequestWithPostId,
  res: NextApiResponse
): Promise<void> {
  const postId: string | null = getIdFromRequest(req, res);
  if (!postId) {
    res.status(StatusCodes.BAD_REQUEST).end();
    return;
  }

  const includeUser: boolean = await isAuthenticated(req, res);
  const post: PostWithBook | PostWithBookWithUser | null = await getPost(
    postId,
    includeUser
  );
  if (post) {
    res //
      .status(StatusCodes.OK) //
      .json(await getPost(postId, includeUser));
    res.end();
    return;
  }
  res.status(StatusCodes.NOT_FOUND).end();
}

async function putHandler(
  req: NextApiRequestWithPostIdAndImage,
  res: NextApiResponse
): Promise<void> {
  const postId: string | null = getIdFromRequest(req, res);
  if (!postId) {
    res.status(StatusCodes.BAD_REQUEST).end();
    return;
  }

  if (!(await isPostFromUser(postId, req, res))) {
    res.status(StatusCodes.FORBIDDEN).end();
    return;
  }

  const updatablePost: UpdatablePost | null = getUpdatablePostFromRequest(req);
  if (!updatablePost) {
    res.status(StatusCodes.BAD_REQUEST).end();
    return;
  }

  const updatedPost: Post = await updatePost(postId, updatablePost);

  try {
    await res.unstable_revalidate("/post/" + postId);
  } catch (error) {
    console.error(error);
  }

  res //
    .status(StatusCodes.OK) //
    .json(updatedPost);
}

async function deleteHandler(
  req: NextApiRequestWithPostId,
  res: NextApiResponse
): Promise<void> {
  const postId: string | null = getIdFromRequest(req, res);
  if (!postId) {
    res.status(StatusCodes.BAD_REQUEST).end();
    return;
  }

  if (!(await isPostFromUser(postId, req, res))) {
    return;
  }

  await deletePost(postId);

  try {
    await res.unstable_revalidate("/post/" + postId);
  } catch (error) {
    console.error(error);
  }

  res.status(StatusCodes.OK).end();
}

function getIdFromRequest(
  req: NextApiRequest,
  res: NextApiResponse
): string | null {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(StatusCodes.BAD_REQUEST).end();
    return null;
  }
  if (!validate(id)) {
    res.status(StatusCodes.BAD_REQUEST).end();
    return null;
  }
  return id;
}

async function isPostFromUser(
  postId: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  const postWithUser = await getPost(postId, true);
  if (!postWithUser) {
    res.status(StatusCodes.NOT_FOUND).end();
    return false;
  }

  const user = await getCurrentUser(req, res);
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).end();
    return false;
  } else if (user.id !== postWithUser.userId) {
    res.status(StatusCodes.FORBIDDEN).end();
    return false;
  }

  return true;
}

function getUpdatablePostFromRequest(
  req: NextApiRequestWithPostIdAndImage
): UpdatablePost | null {
  if (!req.body || typeof req.body !== "object") {
    return null;
  }

  const { price, description, status } = req.body;
  const image = req.file;

  if (description !== undefined && typeof description !== "string") {
    return null;
  }

  if (status !== undefined) {
    if (typeof status !== "string") {
      return null;
    }
    switch (status) {
      case PostStatus.ACTIVE:
      case PostStatus.SOLD:
        break;
      default:
        return null;
    }
  }

  let parsedPrice: any = undefined;
  if (price !== undefined) {
    parsedPrice = getIntStringPriceAsNumber(price);
    if (parsedPrice === null) {
      return null;
    }
  }

  return {
    price: parsedPrice,
    description,
    status,
    image: image ? image.buffer : undefined,
  };
}
