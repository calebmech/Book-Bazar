import { Book, Post, PostStatus, User } from "@prisma/client";
import { prisma } from "./db";
import { deleteImage, uploadImage } from "./image";

export type PostWithBook = Post & {
  book: Book;
};

export type PostWithBookWithUser = PostWithBook & {
  user: User;
};

export type CreatablePost = {
  price: number;
  description: string;
  image?: Buffer;
  bookId: string;
  userId: string;
};

export type UpdatablePost = {
  price?: number;
  description?: string;
  image?: Buffer;
  status?: PostStatus;
};

type UpdatablePostResolved = {
  price?: number;
  description?: string;
  imageUrl?: string;
  status?: PostStatus;
};

/**
 * Returns the post with the given id.
 *
 * @param id the id of the post
 * @param includeUser whether or not the user associated with the post should be returned in the data
 * @returns the post with the given id, or null if the post with the given id cannot be found
 */
export async function getPost(
  id: string,
  includeUser: boolean
): Promise<PostWithBook | PostWithBookWithUser | null> {
  return prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      user: includeUser,
      book: true,
    },
  });
}

/**
 * Creates a post from the given information, then returns the post.
 *
 * Uploads the given image.
 *
 * @param creatablePost the information used to create the posts
 * @returns the created post
 */
export async function createPost(creatablePost: CreatablePost): Promise<Post> {
  let imageUrl: string | undefined = undefined;
  if (creatablePost.image) {
    imageUrl = await uploadImage(creatablePost.image);
  }
  try {
    return prisma.post.create({
      data: {
        description: creatablePost.description,
        imageUrl: imageUrl,
        price: creatablePost.price,
        book: {
          connect: {
            id: creatablePost.bookId,
          },
        },
        user: {
          connect: {
            id: creatablePost.userId,
          },
        },
      },
      include: {
        book: true,
        user: true,
      },
    });
  } catch (e) {
    if (!!imageUrl) {
      deleteImage(imageUrl);
    }
    throw e;
  }
}

/**
 * Updates the given post with the new information, then returns the post.
 *
 * If a new image is provided, then old image is deleted, and the new image is uploaded.
 *
 * @param id the id of the post to update
 * @param updatablePost the new information for the post
 * @returns the updated post
 * @throws if there is no post with the given id
 */
export async function updatePost(
  id: string,
  updatablePost: UpdatablePost
): Promise<Post> {
  if (updatablePost.image) {
    const currentPost: Post = (await getPost(id, false)) as Post;
    const currentImageUrl = currentPost.imageUrl;
    const newImageUrl = await uploadImage(updatablePost.image);
    const updatablePostResolved = getUpdatablePostResolved(
      updatablePost,
      newImageUrl
    );

    try {
      const newPost = await prisma.post.update({
        where: {
          id: id,
        },
        data: updatablePostResolved,
      });
      if (currentImageUrl) {
        await deleteImage(currentImageUrl);
      }
      return newPost;
    } catch (e) {
      await deleteImage(newImageUrl);
      throw e;
    }
  } else {
    return prisma.post.update({
      where: {
        id: id,
      },
      data: updatablePost,
    });
  }
}

/**
 * Deletes the post with the given id and the textbook image associated with the post.
 *
 * @param id the id of the post to delete
 * @throws if there is no post with the given id
 */
export async function deletePost(id: string): Promise<void> {
  const deletedPost: Post = await prisma.post.delete({
    where: {
      id: id,
    },
  });
  if (deletedPost.imageUrl) {
    await deleteImage(deletedPost.imageUrl);
  }
}

function getUpdatablePostResolved(
  updatablePost: UpdatablePost,
  imageUrl: string
): UpdatablePostResolved {
  return {
    description: updatablePost.description,
    imageUrl: imageUrl,
    price: updatablePost.price,
    status: updatablePost.status,
  };
}
