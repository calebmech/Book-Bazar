import { CourseWithBooks } from "@lib/services/course";
import { PostWithUserWithBook } from "@lib/services/post";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

// With useRouter the routerquery would be undefined for first render, I'm using the enabled option 
// to wait for the router before sending a request

export function useCourseQuery(courseId: string | string[] | undefined): UseQueryResult<CourseWithBooks> {
  return useQuery("course", () =>
    axios.get<CourseWithBooks>(`/api/course/${courseId}/`).then((res) => res.data),
    {
      enabled: !(courseId == undefined || Array.isArray(courseId)),
    }
  );
}

export function useCoursePostsQuery(courseId: string | string[] | undefined): UseQueryResult<PostWithUserWithBook[]> {
  return useQuery("coursePosts", () =>
    axios.get<PostWithUserWithBook[]>(`/api/course/${courseId}/posts/`).then((res) => res.data),
    {
      enabled: !(courseId == undefined || Array.isArray(courseId)),
    }
  )
}