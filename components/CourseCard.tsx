/*
 * This file returns the course card displayed in the search page.
 */

import { Text, Box, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { CourseWithDept } from "@lib/services/course";

type CourseCardProps = {
  course: CourseWithDept;
  isLinkActive: boolean;
};

export default function CourseCard({ course, isLinkActive }: CourseCardProps) {
  const router = useRouter();

  const { id, name, dept, code } = course;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push(`/course/${id}`);
  };

  const card = (
    <Box
      minW="sm"
      borderWidth="1px"
      borderRadius="lg"
      backgroundColor="secondaryBackground"
      shadow="md"
      _hover={{ shadow: "xl" }}
      transition="0.3s"
      cursor={isLinkActive ? "pointer" : "cursor"}
      onClick={handleClick}
    >
      <Heading m="5" mb="0" as="h4" size="md">
        {`${dept.abbreviation} ${code}`}
      </Heading>
      <Text m="5" mt="0">
        {name || "-"}
      </Text>
    </Box>
  );

  if (isLinkActive) {
    return <Link href={"/course/" + id}>{card}</Link>;
  }

  return card;
}
