import { Text, useColorScheme } from "react-native";
import { View } from "@/components/Themed";
import React, { useMemo } from "react";
import MessagesHeader from "@/components/MessagesHeader";
import chatsData from "@/../assets/data/chats.json";
import { Stack } from "expo-router";
import { themedStyles } from "@/constants/Styles";
import ChatsList from "@/components/ChatsList";

const Messages = () => {
  const colorScheme = useColorScheme();
  const chats = useMemo(() => chatsData as any, []);

  const themeBorderStyle =
    colorScheme === "light"
      ? themedStyles.lightBorder
      : themedStyles.darkBorder;

  return (
    <View
      style={[themeBorderStyle, { flex: 1, borderWidth: 0, borderTopWidth: 1 }]} // Probably a better way to do this but idc
    >
      <Stack.Screen
        options={{
          header: () => <MessagesHeader />,
        }}
      />
      <ChatsList chats={chats} />
    </View>
  );
};

export default Messages;
