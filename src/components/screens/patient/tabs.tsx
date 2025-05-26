import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const PatientHomeTabs = ({
  tabs,
  onTabChange,
}: {
  tabs: any;
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
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 8,
      }}
    >
      {tabs.map((item, index) => (
        <Pressable
          onPress={() => selectCategory(index)}
          key={index}
          ref={(el) => (itemsRef.current[index] = el)}
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
          {activeIndex === index ? (
            <TextSemiBold
              style={{ color: "#000", fontSize: 12, textAlign: "center" }}
            >
              {item.name}
            </TextSemiBold>
          ) : (
            <TextRegular
              style={[
                themeTextStyleSecondary,
                { fontSize: 12, textAlign: "center" },
              ]}
            >
              {item.name}
            </TextRegular>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default PatientHomeTabs;
