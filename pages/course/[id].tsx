import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCoursePostsQuery, useCourseQuery } from "@lib/hooks/course";
import { Text } from "@chakra-ui/react";
import Layout from "@components/Layout";
import CardList, { ListType } from "@components/CardList";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: course } = useCourseQuery(id);
  const { data: posts } = useCoursePostsQuery(id);
  
  return (
    <Layout>
      <Text
        mt='1'
        fontSize='4xl'
        fontWeight='semibold'
      >
        {course?.name} {course?.code}
      </Text>
      <CardList 
        type={ListType.BookCardList} 
        books={course?.books} 
        posts={undefined} 
      />
      <CardList 
        type={ListType.PostCardList} 
        posts={posts ? posts : undefined} 
        books={undefined} 
      />
    </Layout>
  );
};

export default CoursePage;