import IconButton from "@/components/IconButton";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";
import { Chat } from "@/types/chat";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
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

  // Firestore references
  const chatDocRef = doc(db, "chats", chatId as string);
  const messagesRef = collection(db, "chats", chatId as string, "messages");

  useEffect(() => {
    if (!chatId) return;

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
      // Transform Firestore data to GiftedChat format
      const loadedMessages = snapshot.docs.map((doc) => {
        const messageData = doc.data();
        return {
          _id: messageData.id || doc.id,
          text: messageData.text,
          createdAt: (messageData.createdAt as Timestamp).toDate(),
          user: {
            _id: messageData.senderId,
            name: messageData.senderName || "System",
            avatar: messageData.avatar || "", // optional
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
    async (newMessages: Message[] = []) => {
      if (!data || !chatId || newMessages.length === 0) return;

      const message = newMessages[0]; // GiftedChat sends 1 at a time by default

      const messagePayload = {
        id: nanoid(), // optional, Firestore doc ID also works
        text: message.text,
        senderId: data.uid,
        avatar: data.image || "",
        createdAt: serverTimestamp(),
      };

      try {
        await addDoc(messagesRef, messagePayload);

        await updateDoc(chatDocRef, {
          lastMessage: {
            text: message.text,
            senderId: data.uid,
            timestamp: serverTimestamp(),
          },
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    },
    [chatId, data]
  );

  if (loading || !data) {
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
          _id: data.uid, // Let giftedchat know who is the current user
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
