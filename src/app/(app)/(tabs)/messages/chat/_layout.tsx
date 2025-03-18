import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StreamChat } from "stream-chat";

// This is a public key, so sfe
const client = StreamChat.getInstance("bs6v2mudrp7y");

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
