/*
 * This file returns the course card displayed in the search page.
 */

import { Text, Box, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { CourseWithDept } from "@lib/services/course";

type CourseCardProps = {
  course: CourseWithDept;
  isLinkActive: boolean;
};

export default function CourseCard({ course, isLinkActive }: CourseCardProps) {
  const { name, dept, code } = course;

  const truncatedName =
    name && name!.length > 40 ? name?.substring(0, 40).trim() + "..." : name;

  const card = (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      backgroundColor="secondaryBackground"
      shadow="md"
      _hover={{ shadow: "xl" }}
      transition="0.3s"
      cursor={isLinkActive ? "pointer" : "cursor"}
    >
      <Heading m="5" mb="0" as="h4" size="md">
        {`${dept.abbreviation} ${code}`}
      </Heading>
      <Text m="5" mt="0">
        {truncatedName || "-"}
      </Text>
    </Box>
  );

  if (isLinkActive) {
    return (
      <Link href={"/course/" + dept.abbreviation + "-" + code}>{card}</Link>
    );
  }

  return card;
}
