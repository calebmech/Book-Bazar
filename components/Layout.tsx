import { Container, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

export interface LayoutProps {
  minimalHeader?: boolean;
  /**
   * Extend the header with additional content
   */
  extendedHeader?: React.ReactNode;
  marginY?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  extendedHeader,
  minimalHeader = false,
}) => {
  return (
    <Flex direction="column" justifyContent="space-between" minHeight="100vh">
      <div>
        <Header minimalContent={minimalHeader}>{extendedHeader}</Header>
        <Container as="main" marginY="8" maxWidth="container.lg">
          {children}
        </Container>
      </div>
      <Footer />
    </Flex>
  );
};

export default Layout;
