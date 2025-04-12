import { View, Text, SafeAreaView } from "react-native";
import React, { ReactElement, useState } from "react";
import Stethoscope from "../icons/Stethoscope";
import PsychologyAlt from "../icons/PsychologyAlt";
import Radiology from "../icons/Radiology";
import MonitorWeight from "../icons/MonitorWeight";
import Emergency from "../icons/Emergency";
import Colors from "@/constants/Colors";
import OnlineConsultation from "../HomeTabs/OnlineConsultation";
import SecondOpinion from "../HomeTabs/SecondOpinion";
import RadiologyImages from "../HomeTabs/RadiologyImages";
import WeightManagement from "../HomeTabs/WeightManagement";
import RemoteManagement from "../HomeTabs/RemoteManagement";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { useUser } from "@/contexts/UserContext";
import { Stack } from "expo-router";
import { PatientHomeHeader } from "../PatientHomeHeader";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";

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

const PatientHomeScreen = () => {
  const [tab, setTab] = useState("Online\nConsultation");
  const [isForward, setIsForward] = useState(false);
  const { data, loading } = useUser();

  const { colorScheme } = useThemedStyles();

  const onTabChange = (newTab: string) => {
    if (newTab === tab) return; // No-op if you're already on that tab

    const oldIndex = tabs.findIndex((t) => t.name === tab);
    const newIndex = tabs.findIndex((t) => t.name === newTab);

    // Calculate forward vs. backward using these stable indices
    const goingForward = newIndex > oldIndex;

    setIsForward(goingForward);
    setTab(newTab);
  };

  const tabComponents: Record<string, ReactElement> = {
    "Online\nConsultation": <OnlineConsultation />,
    "Second\nOpinion": <SecondOpinion />,
    "Radiology\nImages": <RadiologyImages />,
    "Weight\nManagement": <WeightManagement />,
    "Remote ICU\nManagement": <RemoteManagement />,
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

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
          header: () => (
            <PatientHomeHeader onTabChange={onTabChange} tabs={tabs} />
          ),
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <Animated.View
          key={tab}
          entering={isForward ? FadeInRight : FadeInLeft}
          // exiting={isForward ? FadeOutLeft : FadeOutRight}
          style={{
            flex: 1,
          }}
        >
          {tabComponents[tab] || <Text>Tab not found</Text>}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};
export default PatientHomeScreen;
