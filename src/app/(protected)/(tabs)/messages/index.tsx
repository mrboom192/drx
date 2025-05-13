import ChatsList from "@/components/ChatsList";
import MessagesHeader from "@/components/MessagesHeader";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

const Messages = () => {
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: Colors.light.faintGrey,
      }}
    >
      <Stack.Screen
        options={{
          header: () => <MessagesHeader />,
        }}
      />
      <ChatsList />
    </View>
  );
};

export default Messages;
