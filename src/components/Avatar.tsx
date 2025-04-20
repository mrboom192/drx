import React, { useEffect } from "react";
import { Text, Pressable, Image, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { TextSemiBold } from "./StyledText";

const Avatar = ({
  onPress = null,
  size,
  uri = null,
  initials = "",
  color = "#ddd",
  loading = false,
}: {
  onPress?: null | (() => void);
  size: number;
  uri?: string | null;
  initials?: string;
  color?: string;
  loading?: boolean;
}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (loading) {
      opacity.value = withRepeat(
        withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(1);
    }
  }, [loading]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Pressable
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: 9999,
        overflow: "hidden",
      }}
      onPress={onPress}
    >
      {loading ? (
        <Animated.View
          style={[
            {
              width: "100%",
              height: "100%",
              backgroundColor: "#ccc",
              borderRadius: 9999,
            },
            animatedStyle,
          ]}
        />
      ) : uri ? (
        <>
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </>
      ) : (
        <TextSemiBold
          style={{
            color: "#555",
            marginHorizontal: 8,
            textAlign: "center",
          }}
        >
          {initials}
        </TextSemiBold>
      )}
    </Pressable>
  );
};

export default Avatar;
