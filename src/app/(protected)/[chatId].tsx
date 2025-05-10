import Colors from "@/constants/Colors";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Message {
  _id: number;
  text: string;
  createdAt: Date;
  user: User;
}

interface User {
  _id: number;
  name: string;
  avatar: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const insets = useSafeAreaInsets();

  const onSend = useCallback((messages: Message[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <View
      style={{ flex: 1, backgroundColor: "#FFF", paddingBottom: insets.bottom }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: "#000",
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: Colors.peach,
                },
                right: {
                  backgroundColor: Colors.lightLavender,
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default Chat;
