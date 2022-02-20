import { PostWithBookWithUser } from "@lib/services/post";

export default function createTeamsContactUrl(post: PostWithBookWithUser) {
  const cannedMessage =
    "Hi " +
    post.user.name +
    '! I am interested in the book you posted on Book Bazar "' +
    post.book.name +
    '". \n' +
    window.location.href +
    "\nIs it still available?";
  const parameters = new URLSearchParams();
  parameters.set("users", post.user.email);
  parameters.set("message", cannedMessage);
  return "https://teams.microsoft.com/l/chat/0/0?" + parameters.toString();
}
