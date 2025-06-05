import Colors from "@/constants/Colors";
import { themedStyles } from "@/constants/Styles";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconButton from "./IconButton";
import { TextRegular, TextSemiBold } from "./StyledText";

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
  const scrollRef = useRef<typeof ScrollView | null>(null);
  const itemsRef = useRef<Array<typeof TouchableOpacity | null>>([]);
  const colorScheme = useColorScheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : // : themedStyles.darkTextPrimary;
        themedStyles.lightTextPrimary;

  const themeTextStyleSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : // : themedStyles.darkTextSecondary;
        themedStyles.lightTextSecondary;

  const themeBorderStyle =
    colorScheme === "light"
      ? themedStyles.lightBorder
      : // : themedStyles.darkBorder;
        themedStyles.lightBorder;

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    (selected as any)?.measure((x: number) => {
      (scrollRef.current as any)?.scrollTo({
        x: x - 16,
        y: 0,
        animated: true,
      });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={{ backgroundColor: "#FFF", paddingTop: insets.top }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          {/* Messages title */}
          <TextSemiBold style={[themeTextStylePrimary, { fontSize: 32 }]}>
            Consultations
          </TextSemiBold>
          <IconButton
            name="search"
            onPress={() =>
              router.navigate({
                pathname: "/(protected)/(tabs)/messages/search",
              })
            }
          />
        </View>

        <ScrollView
          ref={scrollRef as any}
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
              ref={(el: any) => (itemsRef.current[index] = el)}
              style={[
                {
                  boxSizing: "border-box",
                  // Not proud of this
                  borderColor:
                    activeIndex === index
                      ? "none"
                      : colorScheme === "light"
                      ? Colors.light.faintGrey
                      : // : Colors.dark.faintGrey,
                        Colors.light.faintGrey,
                  borderWidth: 1,
                  backgroundColor:
                    activeIndex === index
                      ? colorScheme === "light"
                        ? "#000"
                        : // : "#fff"
                          "#000"
                      : "transparent",
                },
                styles.filterPill,
              ]}
            >
              <TextRegular
                style={
                  activeIndex === index
                    ? {
                        color:
                          colorScheme === "light"
                            ? "#fff"
                            : // : Colors.dark.background,
                              "#fff",
                        textTransform: "capitalize",
                      }
                    : [themeTextStyleSecondary, { textTransform: "capitalize" }]
                }
              >
                {item.name}
              </TextRegular>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
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
