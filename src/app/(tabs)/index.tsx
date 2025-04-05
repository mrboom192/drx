import { View, Text, StyleSheet } from "react-native";
import React, { ReactElement, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { SafeAreaView } from "@/components/Themed";
import Colors from "@/constants/Colors";
import HomeHeader from "@/components/HomeHeader";
import Animated, { FadeInRight, FadeInLeft } from "react-native-reanimated";
import Stethoscope from "@/components/icons/Stethoscope";
import PsychologyAlt from "@/components/icons/PsychologyAlt";
import Radiology from "@/components/icons/Radiology";
import MonitorWeight from "@/components/icons/MonitorWeight";
import Emergency from "@/components/icons/Emergency";
import OnlineConsultation from "@/components/HomeTabs/OnlineConsultation";
import SecondOpinion from "@/components/HomeTabs/SecondOpinion";
import RadiologyImages from "@/components/HomeTabs/RadiologyImages";
import WeightManagement from "@/components/HomeTabs/WeightManagement";
import RemoteManagement from "@/components/HomeTabs/RemoteManagement";

const tabs = [
  {
    name: "Online\nConsultation",
    icon: <Stethoscope size={24} color={Colors.onlineConsultation} />,
    backgroundColor: Colors.peach,
  },
  {
    name: "Second\nOpinion",
    icon: <PsychologyAlt size={24} color={Colors.secondOpinion} />,
    backgroundColor: Colors.secondOpinionBackground,
  },
  {
    name: "Radiology\nImages",
    icon: <Radiology size={24} color={Colors.radiologyImages} />,
    backgroundColor: Colors.radiologyImagesBackground,
  },
  {
    name: "Weight\nManagement",
    icon: <MonitorWeight size={24} color={Colors.weightManagement} />,
    backgroundColor: Colors.lightLavender,
  },
  {
    name: "Remote ICU\nManagement",
    icon: <Emergency size={24} color={Colors.remoteICUManagement} />,
    backgroundColor: Colors.remoteICUManagementBackground,
  },
];

const Page = () => {
  const [tab, setTab] = useState("Online\nConsultation");
  const [prevTab, setPrevTab] = useState("Online\nConsultation");
  const [isForward, setIsForward] = useState(false);

  const { colorScheme } = useThemedStyles();

  // Get tab index dynamically
  const currentIndex = tabs.findIndex((t) => t.name === tab);
  const prevIndex = tabs.findIndex((t) => t.name === prevTab);

  const onTabChange = (newTab: string) => {
    if (newTab === tab) return; // No-op if you're already on that tab

    const oldIndex = tabs.findIndex((t) => t.name === tab);
    const newIndex = tabs.findIndex((t) => t.name === newTab);

    // Calculate forward vs. backward using these stable indices
    const goingForward = newIndex > oldIndex;

    setIsForward(goingForward);
    setPrevTab(tab);
    setTab(newTab);
  };

  // Log direction when tab changes
  useEffect(() => {
    console.log(isForward);
  }, [isForward]);

  const tabComponents: Record<string, ReactElement> = {
    "Online\nConsultation": <OnlineConsultation />,
    "Second\nOpinion": <SecondOpinion />,
    "Radiology\nImages": <RadiologyImages />,
    "Weight\nManagement": <WeightManagement />,
    "Remote ICU\nManagement": <RemoteManagement />,
  };

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
          header: () => <HomeHeader onTabChange={onTabChange} tabs={tabs} />,
        }}
      />
      <View style={styles.container}>
        <Animated.View
          key={tab}
          entering={isForward ? FadeInRight : FadeInLeft}
          // exiting={isForward ? FadeOutLeft : FadeOutRight}
          style={styles.animatedContainer}
        >
          {tabComponents[tab] || <Text>Tab not found</Text>}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
});

export default Page;
