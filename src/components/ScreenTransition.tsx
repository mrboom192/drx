import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOut,
} from "react-native-reanimated";

export function ScreenTransition({
  direction,
  style,
  children,
}: {
  direction: "Backward" | "Forward";
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const entering = direction === "Forward" ? FadeInRight : FadeInLeft;

  return (
    <Animated.View
      entering={entering}
      exiting={FadeOut.duration(90)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
