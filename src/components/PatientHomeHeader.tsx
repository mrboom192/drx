import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "./Themed";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { Tab } from "@/types/tab";
import UserRow from "./UserRow";

export const PatientHomeHeader = ({
  tabs,
  onTabChange,
}: {
  tabs: Tab[];
  onTabChange: (tabName: string) => void;
}) => {
  const { themeTextStyleSecondary } = useThemedStyles();
  const scrollRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<Array<typeof TouchableOpacity | null>>([]);
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
    <SafeAreaView>
      <View
        style={{
          flexDirection: "column",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <UserRow />
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 8,
            paddingBottom: 16,
          }}
        >
          {tabs.map((item, index) => (
            <Pressable
              onPress={() => selectCategory(index)}
              key={index}
              ref={(el) => ((itemsRef as any).current[index] = el)}
              style={{
                flexDirection: "column",
                width: 80,
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 9999,
                  backgroundColor: item.backgroundColor,
                }}
              >
                {item.icon}
              </View>
              <Text
                style={[
                  activeIndex === index
                    ? { color: "#000", fontFamily: "dm-sb" }
                    : [themeTextStyleSecondary, { fontFamily: "dm" }],
                  { fontSize: 12, textAlign: "center" },
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PatientHomeHeader;
