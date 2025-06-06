import ChatsList from "@/components/ChatsList";
import MessagesHeader from "@/components/MessagesHeader";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { View } from "react-native";

import { useState } from "react";

const Messages = () => {
  const [filter, setFilter] = useState<string>("all");

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        flex: 1,
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: Colors.light.faintGrey,
      }}
    >
      <Stack.Screen
        options={{
          header: () => <MessagesHeader setFilter={setFilter} />,
        }}
      />
      <ChatsList filter={filter} />
    </View>
  );
};

export default Messages;
