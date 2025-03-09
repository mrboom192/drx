import {
  View,
  Text,
  ListRenderItem,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Touchable,
  useColorScheme,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles, themedStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { Doctor } from "@/types/doctor";
import Rating from "./Rating";
import { Chat } from "@/types/chat";
import { format } from "date-fns";
import Colors from "@/constants/Colors";

interface Props {
  chats: Chat[];
}

const ChatsList = ({ chats }: Props) => {
  const [loading, setLoading] = useState(false);
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const colorScheme = useColorScheme();

  //   useEffect(() => {
  //     if (refresh) {
  //       listRef.current?.scrollToOffset({ offset: 0, animated: true });
  //     }
  //   }, [refresh]);

  //   useEffect(() => {
  //     setLoading(true);

  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 200);
  //   }, [specialty]);

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
    <Link href={`/chat/${item.id}`} asChild>
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
            <Text
              style={[
                themeTextStylePrimary,
                { fontFamily: "dm-sb", fontSize: 16 },
              ]}
            >
              {item.doctor_name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[themeTextStyleSecondary, { fontFamily: "dm", flex: 1 }]}
              >
                {item.last_sender_name}: {item.last_message}
              </Text>
            </View>
          </View>

          <Text
            style={[
              themeTextStyleSecondary,
              { fontFamily: "dm", fontSize: 16 },
            ]}
          >
            {format(new Date(item.last_updated * 1000), "h:mm a")}
          </Text>
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
