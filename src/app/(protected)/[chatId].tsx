import IconButton from "@/components/IconButton";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";
import { Chat } from "@/types/chat";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "../../../firebaseConfig";

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

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { data } = useUser();
  const [chatData, setChatData] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { chatId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!chatId) return;

    const chatDocRef = doc(db, "chats", chatId as string);
    const messagesRef = collection(db, "chats", chatId as string, "messages");

    // Listener for chat metadata
    const unsubscribeChat = onSnapshot(
      chatDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setChatData(snapshot.data() as Chat);
          setError(null);
        } else {
          setChatData(null);
          setError("Chat not found.");
        }
        setLoading(false);
      },
      (error) => {
        setError("Error retrieving chat information.");
        setLoading(false);
      }
    );

    // Listener for messages
    const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: data.id || doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(), // Firestore Timestamp → JS Date
          user: {
            _id: data.senderId,
            name: data.senderName || "System",
            avatar: data.avatar || "", // optional
          },
        };
      });

      setMessages(
        loadedMessages.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    });

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [chatId]);

  const onSend = useCallback(
    (messages: Message[] = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [chatId]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextSemiBold style={{ fontSize: 16, color: "#666" }}>
          Loading chat...
        </TextSemiBold>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#FFF", paddingBottom: insets.bottom }}
    >
      <Stack.Screen
        options={{
          presentation: "modal",
          header: () => <ChatHeader chatData={chatData} />,
        }}
      />
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

export default ChatRoom;

const ChatHeader = ({ chatData }: { chatData: any }) => {
  const insets = useSafeAreaInsets();

  if (!chatData) return null;

  // Replace fake values with actual data soon
  return (
    <View style={[header.container, { paddingTop: insets.top }]}>
      <IconButton name="arrow-back" onPress={() => router.back()} />
      <View style={header.chatInfo}>
        <TextSemiBold style={header.chatTitle}>
          Dr. {chatData.participants.doctor.lastName}'s Consultation chat
        </TextSemiBold>
        <TextSemiBold style={header.onlineStatus}>Offline</TextSemiBold>
      </View>
    </View>
  );
};

const header = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 16,
    flexDirection: "row",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey2,
  },
  chatInfo: {
    flexDirection: "column",
  },
  chatTitle: {
    fontSize: 16,
  },
  onlineStatus: {
    fontSize: 16,
    color: Colors.grey,
  },
});
