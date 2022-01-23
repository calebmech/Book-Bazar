import { useColorModeValue } from "@chakra-ui/react";
import { ColorProps } from "@chakra-ui/styled-system";

type Color = ColorProps["color"];
type ThemedColor = { light: Color; dark: Color };

export const Colors = {
  primaryBackground: { light: "gray.50", dark: "gray.800" },
  secondaryBackground: { light: "white", dark: "gray.700" },
  secondaryText: { light: "gray.600", dark: "gray.200" },
} as const;

export function useColor(color: ThemedColor) {
  return useColorModeValue(color.light, color.dark);
}
