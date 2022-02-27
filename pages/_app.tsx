import { ChakraProvider } from "@chakra-ui/react";
import LoadingPage from "@components/LoadingPage";
import { IS_E2E } from "@lib/helpers/env";
import useIsLoading from "@lib/hooks/useIsLoading";
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
  const isLoading = useIsLoading();

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {isLoading ? <LoadingPage /> : <Component {...pageProps} />}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
