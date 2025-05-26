import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

type TabItem = {
  name: string;
  icon: React.ReactNode;
  backgroundColor: string;
};

const PatientHomeTabs = ({
  tabs,
  onTabChange,
}: {
  tabs: TabItem[];
  onTabChange: (tabName: string) => void;
}) => {
  const { themeTextStyleSecondary } = useThemedStyles();
  const scrollRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<Array<View | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    (selected as any)?.measure((x: number) => {
      scrollRef.current?.scrollTo({
        x: x - 16,
        y: 0,
        animated: true,
      });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabChange(tabs[index].name);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      {tabs.map((item: TabItem, index: number) => (
        <Pressable
          onPress={() => selectCategory(index)}
          key={index}
          ref={(el) => {
            itemsRef.current[index] = el;
          }}
          style={styles.tabItem}
        >
          <View
            style={[
              styles.tabCircle,
              { backgroundColor: item.backgroundColor },
            ]}
          >
            {item.icon}
          </View>
          {activeIndex === index ? (
            <TextSemiBold style={styles.activeTabText}>
              {item.name}
            </TextSemiBold>
          ) : (
            <TextRegular style={styles.inactiveTabText}>
              {item.name}
            </TextRegular>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default PatientHomeTabs;

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  tabItem: {
    flexDirection: "column",
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  tabCircle: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  activeTabText: { color: "#000", fontSize: 12, textAlign: "center" },
  inactiveTabText: {
    color: Colors.lightText,
    fontSize: 12,
    textAlign: "center",
  },
});
