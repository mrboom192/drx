import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "./Themed";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import userData from "@/../assets/data/user.json";
import { User } from "@/types/user";
import { Tab } from "@/types/tab";
import Avatar from "./Avatar";

const Header = ({
  data,
  tabs,
  onTabChange,
}: {
  data: any;
  tabs: Tab[];
  onTabChange: (tabName: string) => void;
}) => {
  const { themeBorderStyle, themeTextStyleSecondary, colorScheme } =
    useThemedStyles();
  const user = useMemo(() => userData as User, []);

  const scrollRef = useRef<ScrollView | null>(null);
  const router = useRouter();
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
      <View style={styles.container}>
        <View style={styles.userRow}>
          <WelcomeMessage name={"Jason Nguyen"} />
          <Avatar size={40} uri={user.profileImage} />
        </View>

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

const WelcomeMessage = ({ name }: { name: string }) => {
  const { themeTextStyleSecondary } = useThemedStyles();

  return (
    <View>
      <Text
        style={[
          themeTextStyleSecondary,
          {
            fontFamily: "dm",
            fontSize: 14,
          },
        ]}
      >
        Welcome back,
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontFamily: "dm-sb", fontSize: 20 }}>{name}</Text>
        <Text
          style={{
            fontFamily: "dm-sb",
            fontSize: 12,
            color: Colors.primary,
          }}
        >
          Patient
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userRow: {
    paddingHorizontal: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Header;
