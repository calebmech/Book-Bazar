import { extendTheme, ThemeOverride } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Colors } from "./colors";

const config: ThemeOverride = {
  config: {
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => ({
      body: {
        minHeight: "100vh",
        backgroundColor: mode(
          Colors.primaryBackground.light,
          Colors.primaryBackground.dark
        )(props),
      },
    }),
  },
};

export default extendTheme(config);
