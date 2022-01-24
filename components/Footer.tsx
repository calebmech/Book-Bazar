import { Box, Container } from "@chakra-ui/react";
import { Colors, useColor } from "@styles/colors";
import Image from "next/image";

export default function Footer() {
  return (
    <Box backgroundColor={useColor(Colors.secondaryBackground)} padding={8}>
      <Container maxWidth="container.md">
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
