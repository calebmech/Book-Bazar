import { extendTheme, ThemeOverride } from "@chakra-ui/react";

const config: ThemeOverride = {
  config: {
    useSystemColorMode: true,
  },
  semanticTokens: {
    colors: {
      primaryBackground: {
        default: "gray.50",
        _dark: "gray.800",
      },
      secondaryBackground: {
        default: "white",
        _dark: "gray.700",
      },
      secondaryText: {
        default: "gray.600",
        _dark: "gray.200",
      },
    },
  },
  styles: {
    global: {
      body: {
        minHeight: "100vh",
        backgroundColor: "primaryBackground",
      },
    },
  },
};

export default extendTheme(config);
