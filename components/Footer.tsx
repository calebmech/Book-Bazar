import { Box, Container } from "@chakra-ui/react";
import Image from "next/image";

export default function Footer() {
  return (
    <Box backgroundColor="secondaryBackground" padding={8} boxShadow="base">
      <Container maxWidth="container.lg">
        <a
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
        </a>
      </Container>
    </Box>
  );
}
