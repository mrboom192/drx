import { Text, Pressable, Image, View } from "react-native";
import Colors from "../constants/Colors";
import React from "react";

const Avatar = ({
  onPress = null,
  size,
  uri = null,
  initials = "",
  color = "#ddd",
}: {
  onPress?: null | (() => void);
  size: number;
  uri?: string | null;
  initials?: string;
  color?: string;
}) => {
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
      {uri ? (
        <>
          <Image
            source={{ uri: uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {/* Overlay border */}
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
        <Text
          style={{
            fontFamily: "dm-sb",
            color: "#555",
            marginHorizontal: 8,
            textAlign: "center",
          }}
        >
          {initials}
        </Text>
      )}
    </Pressable>
  );
};

export default Avatar;
