import { getCurrentUser } from "@lib/helpers/backend/user-helpers";
import { CreatablePost, createPost } from "@lib/services/post";
import { Post, User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
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
  .use(uploadManager.single("image"))
  .post(postHandler);

export default handler;

interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

async function postHandler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
): Promise<void> {
  const user: User | null = await getCurrentUser(req, res);
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).end();
    return;
  }

  const creatablePost: CreatablePost | null = await getCreatablePostFromRequest(
    user,
    req
  );
  if (!creatablePost) {
    res.status(StatusCodes.BAD_REQUEST).end();
    return;
  }

  const createdPost: Post = await createPost(creatablePost);
  res.status(StatusCodes.OK).json(createdPost);
  res.end();
}

async function getCreatablePostFromRequest(
  user: User,
  req: NextApiRequestWithFile
): Promise<CreatablePost | null> {

  if (!req.body || typeof req.body !== "object") {
    return null;
  }

  const { price, description, bookId } = req.body;

  if (description !== undefined && typeof description !== "string") {
    return null;
  }

  let parsedPrice: any = undefined;
  if (price !== undefined) {
    if (typeof price !== "string") {
      return null;
    }
    parsedPrice = Number.parseInt(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return null;
    }
  }

  if (!bookId || typeof bookId !== "string" || !validate(bookId)) {
    return null;
  }

  const image: Express.Multer.File | undefined = req.file;

  return {
    price: parsedPrice,
    bookId: bookId,
    description: description,
    image: image ? image.buffer : undefined,
    userId: user.id,
  };
}
