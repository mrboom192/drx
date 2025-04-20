import {
  View,
  ListRenderItem,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import { themedStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { Chat } from "@/types/chat";
import { format } from "date-fns";
import Colors from "@/constants/Colors";
import { TextRegular, TextSemiBold } from "./StyledText";

interface Props {
  chats: Chat[];
}

const ChatsList = ({ chats }: Props) => {
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();

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

  const renderRow: ListRenderItem<Chat> = ({ item }) => (
    <Link href={`/(tabs)/messages/${item.id}`} asChild>
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
            <Image
              source={{ uri: item.doctor_profile_url }}
              style={styles.image}
            />
            {item.doctor_is_online && <View style={styles.onlineIndicator} />}
          </View>

          <View style={{ flex: 1 }}>
            <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
              {item.doctor_name}
            </TextSemiBold>
            <View style={{ flexDirection: "row" }}>
              <TextRegular
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[themeTextStyleSecondary, { flex: 1 }]}
              >
                {item.last_sender_name}: {item.last_message}
              </TextRegular>
            </View>
          </View>

          <TextRegular style={[themeTextStyleSecondary, { fontSize: 16 }]}>
            {format(new Date(item.last_updated * 1000), "h:mm a")}
          </TextRegular>
        </View>
      </TouchableOpacity>
    </Link>
  );

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
  image: {
    width: 64,
    height: 64,
    borderRadius: 9999,
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
