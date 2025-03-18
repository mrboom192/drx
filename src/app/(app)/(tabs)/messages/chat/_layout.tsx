import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ChatLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarColor: "#FFF",
      }}
    />
  );
};

export default ChatLayout;
