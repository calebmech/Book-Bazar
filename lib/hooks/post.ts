import { PostWithBookWithUser } from "@lib/services/post";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

export function usePostQuery(postId: string | string[] | undefined): UseQueryResult<PostWithBookWithUser> {
  return useQuery("post-" + postId, () =>
    axios.get<PostWithBookWithUser>(`/api/post/${postId}/`).then((res) => res.data),
    {
      enabled: !(postId == undefined || Array.isArray(postId)),
    }
  );
}