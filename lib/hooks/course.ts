import { CourseWithBooks } from "@lib/services/course";
import { PostWithBookWithUser } from "@lib/services/post";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

// With useRouter the routerquery would be undefined for first render, I'm using the enabled option
// to wait for the router before sending a request

export function useCourseQuery(
  courseCode: string | string[] | undefined
): UseQueryResult<CourseWithBooks> {
  return useQuery(
    "course-" + courseCode,
    () =>
      axios
        .get<CourseWithBooks>(`/api/course/${courseCode}/`)
        .then((res) => res.data),
    {
      enabled: !(courseCode == undefined || Array.isArray(courseCode)),
    }
  );
}

export function useCoursePostsQuery(
  courseCode: string | string[] | undefined,
  page: number,
  length: number
): UseQueryResult<PostWithBookWithUser[]> {
  const parameters = new URLSearchParams();
  if (page) parameters.set("page", page.toString());
  if (length) parameters.set("length", length.toString());
  return useQuery(
    "course-posts-" + courseCode + "-" + page,
    () =>
      axios
        .get<PostWithBookWithUser[]>(
          "/api/course/" +
            courseCode +
            "/posts/" +
            (page || length ? "/?" + parameters.toString() : "")
        )
        .then((res) => res.data),
    {
      enabled: !(courseCode == undefined || Array.isArray(courseCode)),
      keepPreviousData: true,
    }
  );
}
