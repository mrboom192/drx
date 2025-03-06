import { useColorScheme } from "react-native";
import { useMemo } from "react";
import { themedStyles } from "@/constants/Styles";

export function useThemedStyles() {
  const colorScheme = useColorScheme();

  return useMemo(() => {
    return {
      colorScheme,
      themeTextStylePrimary:
        colorScheme === "light"
          ? themedStyles.lightTextPrimary
          : themedStyles.darkTextPrimary,
      themeTextStyleSecondary:
        colorScheme === "light"
          ? themedStyles.lightTextSecondary
          : themedStyles.darkTextSecondary,
      themeBorderStyle:
        colorScheme === "light"
          ? themedStyles.lightBorder
          : themedStyles.darkBorder,
    };
  }, [colorScheme]);
}
