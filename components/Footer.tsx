import { Box, Container, HStack, Link } from "@chakra-ui/react";
import Image from "next/image";
import GithubIcon from "./GithubIcon";

export default function Footer() {
  return (
    <Box backgroundColor="secondaryBackground" padding={8} boxShadow="base">
      <Container maxWidth="container.lg">
        <HStack spacing="6">
          <Link
            href="http://github.com/calebmech/Book-Bazar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon height="40" width="40" style={{ display: "inline" }} />
          </Link>
          <Link
            href="https://www.vercel.com?utm_source=book-bazar?utm_campaign=oss"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/powered-by-vercel.svg"
              alt="Powered by Vercel"
              priority
              width={212}
              height={44}
            />
          </Link>
        </HStack>
      </Container>
    </Box>
  );
}
