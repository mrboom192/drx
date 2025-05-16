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
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="medical-info" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ProfileLayout;
