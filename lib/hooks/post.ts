import { PostWithBook, PostWithBookWithUser } from "@lib/services/post";
import axios from "axios";
import { useRouter } from "next/router";
import {
  UseQueryResult,
  useQuery,
  useMutation,
  useQueryClient,
} from "react-query";

export function usePostQuery(
  postId: string | string[] | undefined,
  initialData?: PostWithBook
): UseQueryResult<PostWithBookWithUser | PostWithBook> {
  return useQuery(
    ["post", postId],
    () =>
      axios
        .get<PostWithBookWithUser>(`/api/post/${postId}/`)
        .then((res) => res.data),
    {
      enabled: !(postId == undefined || Array.isArray(postId)),
      initialData,
    }
  );
}

export function useDeletePostMutation(postId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(() => axios.delete("/api/post/" + postId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
      router.push("/");
    },
  });
}
