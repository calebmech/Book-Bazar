import { ChakraProvider } from "@chakra-ui/react";
import { IS_E2E } from "@lib/helpers/env";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import theme from "../styles/theme";
import "../styles/reset.css";
import "@algolia/autocomplete-theme-classic";

if (IS_E2E) {
  require("../mocks");
}

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
