import { PostWithUserWithBook } from "@lib/services/post";
import { Post } from "@prisma/client";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

export function usePostQuery(postId: string | string[] | undefined): UseQueryResult<PostWithUserWithBook> {
  return useQuery("post", () =>
    axios.get<PostWithUserWithBook>(`/api/post/${postId}/`).then((res) => res.data),
    {
      enabled: !(postId == undefined || Array.isArray(postId)),
    }
  );
}