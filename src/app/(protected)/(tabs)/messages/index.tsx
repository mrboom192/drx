import ChatsList from "@/components/ChatsList";
import MessagesHeader from "@/components/MessagesHeader";
import { TextSemiBold } from "@/components/StyledText";
import { View } from "@/components/Themed";
import { themedStyles } from "@/constants/Styles";
import { useUser } from "@/contexts/UserContext";
import { Chat } from "@/types/chat";
import { Stack } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { db } from "../../../../../firebaseConfig";

const Messages = () => {
  const colorScheme = useColorScheme();
  const [chats, setChats] = useState<Chat[] | null>(null);
  const { data } = useUser();

  // Fetch chats from Firebase
  useEffect(() => {
    if (!data) return;

    const chatsRef = collection(db, "chats");

    const q = query(
      chatsRef,
      where("users", "array-contains", data.uid),
      orderBy("lastMessage.timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatData as Chat[]);
      },
      (error) => {
        console.error("Error subscribing to chats:", error);
      }
    );

    return () => unsubscribe(); // Clean up on unmount
  }, [data]);

  const themeBorderStyle =
    colorScheme === "light"
      ? themedStyles.lightBorder
      : themedStyles.darkBorder;

  if (chats === null) {
    return (
      <View>
        <TextSemiBold style={{ textAlign: "center", marginTop: 20 }}>
          Loading...
        </TextSemiBold>
      </View>
    );
  }

  return (
    <View
      style={[themeBorderStyle, { flex: 1, borderWidth: 0, borderTopWidth: 1 }]}
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
