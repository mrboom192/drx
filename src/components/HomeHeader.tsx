import { StyleSheet, Image } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
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
import { useThemedStyles } from "@/hooks/useThemeStyles";

import userData from "@/../assets/data/user.json";
import { User } from "@/types/user";

interface Props {}

const HomeHeader = ({}: Props) => {
  const { themeBorderStyle, colorScheme } = useThemedStyles();
  const user = useMemo(() => userData as User, []);

  return (
    <SafeAreaView>
      <View style={[themeBorderStyle, styles.container]}>
        <TouchableOpacity>
          <Image
            source={{ uri: user.profileImage }}
            style={[themeBorderStyle, styles.image]}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text
          style={{ fontFamily: "dm-sb", color: Colors.primary, fontSize: 32 }}
        >
          Patient
        </Text>

        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            color={colorScheme === "light" ? "#000" : "#FFF"}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    // backgroundColor: "#FF00FF",
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
  },
  filterBtn: {
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    gap: 10,
    flex: 1,
    padding: 14,
    borderRadius: 30,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 9999,
  },
});

export default HomeHeader;
