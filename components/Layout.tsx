import { Container, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

export interface LayoutProps {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" justifyContent="space-between" minHeight="100vh">
      <div>
        <Header />
        <Container as="main" marginY={8} maxWidth="container.md">
          {children}
        </Container>
      </div>
      <Footer />
    </Flex>
  );
};

export default Layout;
