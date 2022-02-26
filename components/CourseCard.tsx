/*
 * This file returns the course card displayed in the search page.
 */

import { Text, Box, Heading } from "@chakra-ui/react";
import React from "react";
import { CourseWithDept } from "@lib/services/course";
import Link from "next/link";

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
      as={isLinkActive ? "a" : "div"}
      p="5"
    >
      <Heading mb="1" as="h4" size="md">
        {`${dept.abbreviation} ${code}`}
      </Heading>
      <Text>{truncatedName || "\u2013"}</Text>
    </Box>
  );

  if (isLinkActive) {
    return (
      <Link href={"/course/" + dept.abbreviation + "-" + code} passHref>
        {card}
      </Link>
    );
  }

  return card;
}
