import Colors from "@/constants/Colors";
import { themedStyles } from "@/constants/Styles";
import { useUser } from "@/contexts/UserContext";
import { Chat } from "@/types/chat";
import { format } from "date-fns";
import { Link } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Avatar from "./Avatar";
import { TextRegular, TextSemiBold } from "./StyledText";

interface Props {
  chats: Chat[];
}

const ChatsList = ({ chats }: Props) => {
  const [loading, setLoading] = useState(false);
  const { data } = useUser();
  const listRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();

  const getSenderName = (uid: string, chat: Chat): string => {
    if (uid === "system") return "System";

    if (chat.participants.doctor.uid === uid) {
      return `${chat.participants.doctor.firstName} ${chat.participants.doctor.lastName}`;
    }

    if (chat.participants.patient.uid === uid) {
      return `${chat.participants.patient.firstName} ${chat.participants.patient.lastName}`;
    }

    return "Unknown";
  };

  const themeBorderStyle =
    colorScheme === "light"
      ? themedStyles.lightBorder
      : themedStyles.darkBorder;

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : themedStyles.darkTextPrimary;

  const themeTextStyleSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : themedStyles.darkTextSecondary;

  const renderRow: ListRenderItem<Chat> = ({ item: chat }) => (
    <Link
      href={{
        pathname: `/(protected)/(tabs)/messages/[id]`,
        params: { id: chat.id },
      }}
      asChild
    >
      <TouchableOpacity>
        <View
          style={[
            themeBorderStyle,
            {
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: 16,
              gap: 16,
              flex: 1,
              borderWidth: 0,
              borderBottomWidth: 1,
            },
          ]}
        >
          <View style={styles.imageContainer}>
            <Avatar
              size={64}
              uri={
                data?.role === "patient"
                  ? chat.participants.doctor.image
                  : chat.participants.patient.image
              }
            />
          </View>

          <View style={{ flex: 1 }}>
            <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
              {chat.participants.doctor.firstName}{" "}
              {chat.participants.doctor.lastName}
            </TextSemiBold>
            <View style={{ flexDirection: "row" }}>
              <TextRegular
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[themeTextStyleSecondary, { flex: 1 }]}
              >
                <TextSemiBold>
                  {getSenderName(chat.lastMessage.senderId, chat)}:{" "}
                </TextSemiBold>
                {chat.lastMessage.text}
              </TextRegular>
            </View>
          </View>

          <TextRegular style={[themeTextStyleSecondary, { fontSize: 16 }]}>
            {format(new Date(chat.lastMessage.timestamp * 1000), "h:mm a")}
          </TextRegular>
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (chats.length === 0) {
    return (
      <View
        style={[
          themeBorderStyle,
          {
            flex: 1,
            borderWidth: 0,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <TextSemiBold
          style={{
            color: Colors.grey,
            fontSize: 16,
            width: 256,
            textAlign: "center",
          }}
        >
          {data?.role === "doctor"
            ? "You currently have no chats"
            : "Book a consultation to start chatting with a doctor"}
        </TextSemiBold>
      </View>
    );
  }

  return (
    <FlatList
      renderItem={renderRow}
      data={loading ? [] : chats}
      ref={listRef}
    />
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
