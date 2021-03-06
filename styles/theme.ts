import { extendTheme, ThemeOverride } from "@chakra-ui/react";

const config: ThemeOverride = {
  config: {
    useSystemColorMode: true,
    initialColorMode: "dark",
  },
  colors: {
    microsoftTeams: {
      200: "#7B83EB",
      300: "#505AC9",
      500: "#505AC9",
      600: "#464EB8",
    },
    mcmaster: {
      50: "#ffebf4",
      100: "#ffccdc",
      200: "#ff7a7f",
      600: "#850044",
    },
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
        default: "gray.100",
        _dark: "gray.900",
      },
      primaryText: {
        default: "gray.800",
        _dark: "whiteAlpha.900",
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
      fieldDecoration: {
        default: "gray.300",
        _dark: "gray.600",
      },
      accent: {
        default: "teal.500",
        _dark: "teal.200",
      },
      accentHover: {
        default: "teal.600",
        _dark: "teal.300",
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
