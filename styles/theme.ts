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
      tertiaryBackground: {
        default: "gray.300",
        _dark: "gray.700",
      },
      secondaryText: {
        default: "gray.600",
        _dark: "gray.200",
      },
      tertiaryText: {
        default: "gray.500",
        _dark: "gray.300",
      },
      captionText: {
        default: "gray.400",
        _dark: "gray.500",
      },
    },
    fonts: {
      title: "Lora, Georgia, serif",
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
