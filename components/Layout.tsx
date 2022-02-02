import { Container, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

export interface LayoutProps {
  hideHeaderSearch?: boolean;
  /**
   * Extend the header with additional content
   */
  extendedHeader?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  extendedHeader,
  hideHeaderSearch = false,
}) => {
  return (
    <Flex direction="column" justifyContent="space-between" minHeight="100vh">
      <div>
        <Header hideSearch={hideHeaderSearch}>{extendedHeader}</Header>
        <Container as="main" marginY={8} maxWidth="container.lg">
          {children}
        </Container>
      </div>
      <Footer />
    </Flex>
  );
};

export default Layout;
