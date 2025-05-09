import Colors from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { Stack } from "expo-router";
import React, { ReactElement, useState } from "react";
import OnlineConsultation from "../HomeTabs/OnlineConsultation";
import RadiologyImages from "../HomeTabs/RadiologyImages";
import RemoteManagement from "../HomeTabs/RemoteManagement";
import SecondOpinion from "../HomeTabs/SecondOpinion";
import WeightManagement from "../HomeTabs/WeightManagement";
import Emergency from "../icons/Emergency";
import MonitorWeight from "../icons/MonitorWeight";
import PsychologyAlt from "../icons/PsychologyAlt";
import Radiology from "../icons/Radiology";
import Stethoscope from "../icons/Stethoscope";
import { PatientHomeHeader } from "../PatientHomeHeader";
import { ScreenTransition } from "../ScreenTransition";
import { TextRegular } from "../StyledText";
import { View } from "../Themed";

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
  const { loading } = useUser();

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
    return <TextRegular>Loading...</TextRegular>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => (
            <PatientHomeHeader onTabChange={onTabChange} tabs={tabs} />
          ),
        }}
      />
      <ScreenTransition
        key={tab}
        direction={isForward ? "Forward" : "Backward"}
        style={{ flex: 1 }}
      >
        {tabComponents[tab] || <TextRegular>Tab not found</TextRegular>}
      </ScreenTransition>
    </View>
  );
};
export default PatientHomeScreen;
