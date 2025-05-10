import ChatsList from "@/components/ChatsList";
import MessagesHeader from "@/components/MessagesHeader";
import { View } from "@/components/Themed";
import { themedStyles } from "@/constants/Styles";
import { useUser } from "@/contexts/UserContext";
import { Stack } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { db } from "../../../../../firebaseConfig";

const Messages = () => {
  const colorScheme = useColorScheme();
  const [chats, setChats] = useState<any[]>([]);
  const { data, loading } = useUser();

  // Fetch chats from Firebase
  useEffect(() => {
    const fetchChats = async () => {
      if (loading || !data) return;

      try {
        const chatsRef = collection(db, "chats");

        const q = query(
          chatsRef,
          where("users", "array-contains", data.uid),
          orderBy("latestMessageTime", "desc") // assumes field exists and is a Timestamp
        );

        const snapshot = await getDocs(q);
        const chatData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setChats(chatData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [data]);

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
