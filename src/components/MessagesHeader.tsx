import { StyleSheet, useColorScheme } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "./Themed";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { themedStyles } from "@/constants/Styles";

const tabs = [
  {
    name: "all",
  },
  {
    name: "ongoing",
  },
  {
    name: "finished",
  },
  { name: "pending" },
];

interface Props {}

const MessagesHeader = ({}: Props) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const router = useRouter();
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const colorScheme = useColorScheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : themedStyles.darkTextPrimary;

  const themeTextStyleSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : themedStyles.darkTextSecondary;

  const themeBorderStyle =
    colorScheme === "light"
      ? themedStyles.lightBorder
      : themedStyles.darkBorder;

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    selected?.measure((x: number) => {
      scrollRef.current?.scrollTo({
        x: x - 16,
        y: 0,
        animated: true,
      });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          {/* Messages title */}
          <Text
            style={[
              themeTextStylePrimary,
              { fontSize: 32, fontFamily: "dm-sb" },
            ]}
          >
            Messages
          </Text>

          <TouchableOpacity
            onPress={() => {
              //   router.push("/(modals)/filter");
            }}
            style={[themeBorderStyle, styles.searchBtn]}
          >
            <Ionicons
              name="search"
              size={24}
              color={
                colorScheme === "light" ? Colors.light.grey : Colors.dark.grey
              }
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            themeBorderStyle,
            {
              borderWidth: 0,
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 16,
              paddingBottom: 16,
            },
          ]}
        >
          {tabs.map((item, index) => (
            <TouchableOpacity
              onPress={() => selectCategory(index)}
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              style={[
                {
                  boxSizing: "border-box",
                  // Not proud of this
                  borderColor:
                    activeIndex === index
                      ? "none"
                      : colorScheme === "light"
                      ? Colors.light.faintGrey
                      : Colors.dark.faintGrey,
                  borderWidth: 1,
                  backgroundColor:
                    activeIndex === index
                      ? colorScheme === "light"
                        ? "#000"
                        : "#fff"
                      : "none",
                },
                styles.filterPill,
              ]}
            >
              <Text
                style={
                  activeIndex === index
                    ? {
                        color:
                          colorScheme === "light"
                            ? "#fff"
                            : Colors.dark.background,
                        fontFamily: "dm",
                        textTransform: "capitalize",
                      }
                    : [
                        themeTextStyleSecondary,
                        { fontFamily: "dm", textTransform: "capitalize" },
                      ]
                }
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
  },
  searchBtn: {
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 9999,
  },
});

export default MessagesHeader;
