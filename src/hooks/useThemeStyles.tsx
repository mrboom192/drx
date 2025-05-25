import { themedStyles } from "@/constants/Styles";
import { useMemo } from "react";
import { useColorScheme } from "react-native";

export function useThemedStyles() {
  const colorScheme = useColorScheme();

  return useMemo(() => {
    return {
      colorScheme,
      themeTextStylePrimary:
        colorScheme === "light"
          ? themedStyles.lightTextPrimary
          : // : themedStyles.darkTextPrimary,
            themedStyles.lightTextPrimary,
      themeTextStyleSecondary:
        colorScheme === "light"
          ? themedStyles.lightTextSecondary
          : // : themedStyles.darkTextSecondary,
            themedStyles.lightTextSecondary,
      themeBorderStyle:
        colorScheme === "light"
          ? themedStyles.lightBorder
          : // : themedStyles.darkBorder,
            themedStyles.lightBorder,
    };
  }, [colorScheme]);
}
