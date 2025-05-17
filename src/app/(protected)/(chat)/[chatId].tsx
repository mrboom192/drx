import IconButton from "@/components/IconButton";
import CustomIcon from "@/components/icons/CustomIcon";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useChatsById } from "@/stores/useChatStore";
import { useUserData } from "@/stores/useUserStore";
import { getSenderAvatar, getSenderName } from "@/utils/chatUtils";
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
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "../../../../firebaseConfig";

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
  const userData = useUserData();
  const [loading, setLoading] = useState(true);
  const { chatId } = useLocalSearchParams();
  const chat = useChatsById(chatId as string);
  const insets = useSafeAreaInsets();

  // Firestore references
  const chatDocRef = doc(db, "chats", chatId as string);
  const messagesRef = collection(db, "chats", chatId as string, "messages");

  // Mainly used to fetch the chat data and messages
  useEffect(() => {
    if (!chat) {
      setLoading(false);
      return;
    }

    // Fetch chat messages
    const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: data.id || doc.id,
          text: data.text,
          createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
          user: {
            _id: data.senderId,
            name: getSenderName(data.senderId, chat),
            avatar: getSenderAvatar(data.senderId, chat),
          },
        };
      });

      // Sort messages by createdAt in descending order
      setMessages(
        loadedMessages.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    });

    // Below causes infinite loop when uncommented
    setLoading(false);

    return () => unsubscribeMessages();
  }, []);

  // Handle whenever the user sends a message
  const onSend = useCallback(async (newMessages: Message[] = []) => {
    if (!userData || !chatId || newMessages.length === 0) return;

    const message = newMessages[0]; // GiftedChat sends 1 at a time by default

    const messagePayload = {
      id: nanoid(), // optional, Firestore doc ID also works
      text: message.text,
      senderId: userData.uid,
      avatar: userData.image || "",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(messagesRef, messagePayload);

      await updateDoc(chatDocRef, {
        lastMessage: {
          text: message.text,
          senderId: userData.uid,
          timestamp: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }, []);

  // Loading logic
  if (loading || !userData) {
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
          header: () => <ChatHeader chatId={chatId as string} />,
        }}
      />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userData.uid, // Let giftedchat know who is the current user
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

const ChatHeader = ({ chatId }: { chatId: string }) => {
  const insets = useSafeAreaInsets();
  const userData = useUserData();
  const chatData = useChatsById(chatId as string);
  const isDoctor = userData?.role === "doctor";

  if (!chatData) {
    return null; // or a loading spinner
  }

  const otherUser = isDoctor
    ? chatData.participants.patient
    : chatData.participants.doctor;

  const presence = useUserPresence(otherUser.uid);
  const callId = [userData?.uid, otherUser.uid].sort().join("_");

  const handleCall = async () => {
    try {
      const docRef = doc(db, "chats", chatId);
      await updateDoc(docRef, { hasActiveCall: true });
    } catch (err) {
      console.error("Error updating chat document:", err);
    }

    router.navigate({
      pathname: "/(protected)/(call)/[callId]",
      params: {
        otherPersonFirstName: otherUser.firstName,
        otherPersonLastName: otherUser.lastName,
        chatId,
        callId,
        callerType: userData?.role === "doctor" ? "caller" : "callee",
      },
    });
  };

  // Replace fake values with actual data soon
  return (
    <View style={[header.container, { paddingTop: insets.top }]}>
      <View style={header.left}>
        <IconButton name="arrow-back" onPress={() => router.back()} />
        <View style={header.chatInfo}>
          <TextSemiBold style={header.chatTitle}>
            Dr. {chatData.participants.doctor.lastName}'s Consultation Room
          </TextSemiBold>
          <TextSemiBold
            style={[
              header.onlineStatus,
              { color: presence === "online" ? Colors.green : Colors.grey },
            ]}
          >
            {otherUser.firstName} {otherUser.lastName} is {presence}
          </TextSemiBold>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleCall}
        style={[
          header.callButton,
          chatData.hasActiveCall || isDoctor
            ? header.callButton_On
            : header.callButton_Off,
        ]}
        disabled={!isDoctor && !chatData.hasActiveCall}
      >
        <CustomIcon name="videocam" size={24} color={"#FFF"} />
      </TouchableOpacity>
    </View>
  );
};

const header = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
  callButton: {
    borderRadius: 9999,
    paddingVertical: 8,

    justifyContent: "center",
    alignItems: "center",
  },
  callButton_On: {
    backgroundColor: Colors.green,
    paddingHorizontal: 16,
  },
  callButton_Off: {
    backgroundColor: Colors.lightGrey2,
    paddingHorizontal: 8,
  },
});
