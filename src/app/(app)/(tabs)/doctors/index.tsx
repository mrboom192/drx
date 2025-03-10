import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useCallback, useRef } from "react";
import { Link, Stack } from "expo-router";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { SafeAreaView } from "@/components/Themed";
import Colors from "@/constants/Colors";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import InfoBottomSheet from "@/components/InfoBottomSheet";
import HomeHeader from "@/components/HomeHeader";
import Animated from "react-native-reanimated";
import Stethoscope from "@/components/icons/Stethoscope";
import PsychologyAlt from "@/components/icons/PsychologyAlt";
import Radiology from "@/components/icons/Radiology";
import MonitorWeight from "@/components/icons/MonitorWeight";
import Emergency from "@/components/icons/Emergency";
import ArrowOutward from "@/components/icons/ArrowOutward";
import HealthShield from "@/components/icons/HealthShield";
import OnlineConsultation from "@/components/HomeTabs/OnlineConsultation";

const tabs = [
  {
    name: "Online\nConsultation",
    icon: <Stethoscope size={24} color={"#FF8E43"} />,
    backgroundColor: "#FFECD9",
  },
  {
    name: "Second\nOpinion",
    icon: <PsychologyAlt size={24} color={"#43C0FF"} />,
    backgroundColor: "#D9F4FF",
  },
  {
    name: "Radiology\nImages",
    icon: <Radiology size={24} color={"#FF4346"} />,
    backgroundColor: "#FFEDEF",
  },
  {
    name: "Weight\nManagement",
    icon: <MonitorWeight size={24} color={"#D556FF"} />,
    backgroundColor: "#FBEDFD",
  },
  {
    name: "Remote ICU\nManagement",
    icon: <Emergency size={24} color={"#998AFF"} />,
    backgroundColor: "#EDEFFE",
  },
];

const Page = () => {
  const {
    colorScheme,
    themeBorderStyle,
    themeTextStylePrimary,
    themeTextStyleSecondary,
  } = useThemedStyles();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present(); // Collapses bottom sheet, showing map
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "light"
            ? Colors.light.background
            : Colors.dark.background,
      }}
    >
      <Stack.Screen
        options={{
          header: () => <HomeHeader tabs={tabs} />,
        }}
      />
      <Animated.View style={styles.container}>
        <OnlineConsultation />
      </Animated.View>

      <InfoBottomSheet ref={bottomSheetModalRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 9999,
  },
});

export default Page;
