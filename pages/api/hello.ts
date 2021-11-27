// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@lib/services/db";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

async function getPost() {
  const post = await prisma.post.findFirst({
    include: {
      book: true,
    },
  });

  return post;
}

export type PostWithBook = Prisma.PromiseReturnType<typeof getPost>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostWithBook>
) {
  const post = await getPost();

  if (post) {
    res.status(200).json(post);
  }
}
