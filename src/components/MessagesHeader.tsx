import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { getTabs } from "@/constants/tabs";

interface Props {
  setFilter: (filter: string) => void;
}

const MessagesHeader = ({ setFilter }: Props) => {
  const { t } = useTranslation();
  const tabs = useMemo(() => getTabs(t), [t]);
  const scrollRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<Array<typeof TouchableOpacity | null>>([]);
  const colorScheme = useColorScheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const selectCategory = (filter: string, index: number) => {
    const selected = itemsRef.current[index] as View | null;
    setFilter(filter);
    setActiveIndex(index);

    // if (selected && scrollRef.current) {
    //   selected.measure((fx, fy, width, height, px, py) => {
    //     scrollRef.current?.scrollTo({
    //       x: px - 16,
    //       y: 0,
    //       animated: true,
    //     });
    //   });
    // }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={{ backgroundColor: "#FFF", paddingTop: insets.top }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          {/* Messages title */}
          <TextSemiBold style={{ fontSize: 32 }}>
            {t("common.consultations")}
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
          contentContainerStyle={{
            borderWidth: 0,
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          {tabs.map((item, index) => (
            <TouchableOpacity
              onPress={() => selectCategory(item.id, index)}
              key={index}
              ref={(el: any) => (itemsRef.current[index] = el)}
              style={[
                {
                  boxSizing: "border-box",
                  borderColor:
                    activeIndex === index ? "none" : Colors.light.faintGrey,
                  borderWidth: 1,
                  backgroundColor:
                    activeIndex === index ? "#000" : "transparent",
                },
                styles.filterPill,
              ]}
            >
              <TextRegular
                style={
                  activeIndex === index
                    ? {
                        color: "#fff",
                        textTransform: "capitalize",
                      }
                    : { textTransform: "capitalize", color: Colors.grey }
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
