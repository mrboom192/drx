import Colors from "@/constants/Colors";
import { themedStyles } from "@/constants/Styles";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useChats, useIsFetchingChats } from "@/stores/useChatStore";
import { useUserData } from "@/stores/useUserStore";
import { Chat } from "@/types/chat";
import { getSenderName } from "@/utils/chatUtils";
import { format } from "date-fns";
import { Link } from "expo-router";
import React, { useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Avatar from "./Avatar";
import { TextRegular, TextSemiBold } from "./StyledText";
import { useTranslation } from "react-i18next";

const ChatsList = ({ filter }: { filter: string }) => {
  const { t } = useTranslation();
  const userData = useUserData();
  const listRef = useRef<FlatList>(null);
  const chats = useChats();
  const isFetchingChats = useIsFetchingChats();

  if (chats === null) {
    return (
      <View>
        <TextSemiBold style={{ textAlign: "center", marginTop: 20 }}>
          Loading...
        </TextSemiBold>
      </View>
    );
  }

  const filteredChats =
    filter !== "all" ? chats.filter((chat) => chat.status === filter) : chats;

  if (filteredChats.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextSemiBold
          style={{
            color: Colors.grey,
            fontSize: 16,
            width: 256,
            textAlign: "center",
          }}
        >
          {filter !== "all"
            ? t("chats.no-chats-found")
            : userData?.role === "doctor"
            ? t("chats.you-currently-have-no-chats")
            : t("chats.book-a-consultation-to-start-chatting-with-a-doctor")}
        </TextSemiBold>
      </View>
    );
  }

  return (
    <FlatList
      renderItem={({ item }) => <ChatRow chat={item} />}
      data={isFetchingChats ? [] : filteredChats}
      ref={listRef}
    />
  );
};

const ChatRow = ({ chat }: { chat: Chat }) => {
  const userData = useUserData();
  const otherUser =
    userData?.role === "patient"
      ? chat.participants.doctor
      : chat.participants.patient;

  const presence = useUserPresence(otherUser.uid);

  return (
    <Link
      href={{
        pathname: `/(protected)/(chat)/[chatId]`,
        params: { chatId: chat.id },
      }}
      asChild
    >
      <TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: 16,
            gap: 16,
            flex: 1,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <View style={styles.imageContainer}>
            <Avatar
              size={64}
              uri={otherUser.image}
              presence={presence}
              initials={otherUser.firstName[0] + otherUser.lastName[0]}
            />
          </View>

          <View style={{ flex: 1 }}>
            <TextSemiBold style={{ fontSize: 16 }}>
              {userData?.role === "doctor"
                ? chat.participants.patient.firstName +
                  " " +
                  chat.participants.patient.lastName
                : chat.participants.doctor.firstName +
                  " " +
                  chat.participants.doctor.lastName}
            </TextSemiBold>
            <View style={{ flexDirection: "row" }}>
              <TextRegular
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{ flex: 1, color: Colors.grey }}
              >
                <TextSemiBold>
                  {getSenderName(chat.lastMessage.senderId, chat)}:{" "}
                </TextSemiBold>
                {chat.lastMessage.text}
              </TextRegular>
            </View>
          </View>

          <TextRegular style={{ fontSize: 16, color: Colors.grey }}>
            {format(new Date(chat.lastMessage.timestamp * 1000), "h:mm a")}
          </TextRegular>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    borderRadius: 16,
    justifyContent: "space-between",
  },
  info: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  price: {
    height: 64,
    width: 64,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    position: "relative", // Allows absolute positioning inside
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: Colors.green, // Green for online
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: Colors.light.background, // Border to make it stand out
  },
});

export default ChatsList;
