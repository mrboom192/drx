import Colors from "@/constants/Colors";
import {
  SafeAreaView as DefaultSafeAreaView,
  ScrollView as DefaultScrollView,
  Text as DefaultText,
  TouchableOpacity as DefaultTouchableOpacity,
  View as DefaultView,
  ScrollViewProps as RNScrollViewProps,
  TextProps as RNTextProps,
  TouchableOpacityProps as RNTouchableOpacityProps,
  ViewProps as RNViewProps,
} from "react-native";

import React, { ComponentRef, forwardRef } from "react";

// Shared theme props
type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

// Combined props for each component
export type TextProps = ThemeProps & RNTextProps;
export type ViewProps = ThemeProps & RNViewProps;
export type SafeAreaViewProps = ThemeProps & DefaultSafeAreaView["props"];
export type TouchableOpacityProps = ThemeProps & RNTouchableOpacityProps;
export type ScrollViewProps = ThemeProps & RNScrollViewProps;

// Hook to get the correct themed color
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // const theme = useColorScheme() ?? "light";
  const theme = "light";

  return props[theme] ?? Colors[theme][colorName];
}

// Themed Text component
export function Text({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: TextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

// Themed View component
export function View({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

// Themed SafeAreaView component
export function SafeAreaView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: SafeAreaViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultSafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

// Themed TouchableOpacity component
export const TouchableOpacity = forwardRef<
  ComponentRef<typeof DefaultTouchableOpacity>,
  TouchableOpacityProps
>(({ style, lightColor, darkColor, ...otherProps }, ref) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultTouchableOpacity
      ref={ref}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
});

// Themed ScrollView component
export const ScrollView = forwardRef<DefaultScrollView, ScrollViewProps>(
  ({ style, lightColor, darkColor, ...otherProps }, ref) => {
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );

    return (
      <DefaultScrollView
        ref={ref}
        style={[{ backgroundColor }, style]}
        {...otherProps}
      />
    );
  }
);
