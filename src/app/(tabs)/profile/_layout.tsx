import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        navigationBarColor: "#FFF",
        headerTitleStyle: {
          fontFamily: "dm-sb",
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    />
  );
};

export default ProfileLayout;
