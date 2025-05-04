import { Stack } from "expo-router";
import React from "react";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "DMSans_600SemiBold",
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    />
  );
};

export default ProfileLayout;
