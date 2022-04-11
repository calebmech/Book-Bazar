import { PopulatedBook } from "@lib/services/book";
import { PostWithBookWithUser } from "@lib/services/post";
import { resolveBookTitle } from "./resolve-book-data";

export default function createTeamsContactUrl(
  post: PostWithBookWithUser,
  book?: PopulatedBook
) {
  const cannedMessage =
    "Hi " +
    post.user.name +
    '! I am interested in the book you posted on Book Bazar "' +
    resolveBookTitle(book ?? post.book) +
    '". \n' +
    window.location.href +
    "\nIs it still available?";
  return (
    `https://teams.microsoft.com/l/chat/0/0?` +
    `users=${encodeURIComponent(post.user.email)}` +
    `&message=${encodeURIComponent(cannedMessage)}`
  );
}
