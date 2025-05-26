import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React, { ReactElement, useState } from "react";
import OnlineConsultation from "../HomeTabs/OnlineConsultation";
import RadiologyImages from "../HomeTabs/RadiologyImages";
import RemoteManagement from "../HomeTabs/RemoteManagement";
import SecondOpinion from "../HomeTabs/SecondOpinion";
import WeightManagement from "../HomeTabs/WeightManagement";
import CustomIcon from "../icons/CustomIcon";
import Emergency from "../icons/Emergency";
import PsychologyAlt from "../icons/PsychologyAlt";
import Radiology from "../icons/Radiology";
import PageScrollView from "../PageScrollView";
import { PatientHomeHeader } from "../PatientHomeHeader";
import { ScreenTransition } from "../ScreenTransition";
import { TextRegular } from "../StyledText";
import PatientHomeTabs from "./patient/tabs";

const tabs = [
  {
    name: "Online\nConsultation",
    icon: (
      <CustomIcon
        name="stethoscope"
        size={24}
        color={Colors.onlineConsultation}
      />
    ),
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
    icon: (
      <CustomIcon
        size={24}
        color={Colors.weightManagement}
        name="monitor-weight"
      />
    ),
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

  // Trying to handle tab animations
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

  return (
    <PageScrollView showsVerticalScrollIndicator={false} style={{ padding: 0 }}>
      <Stack.Screen
        options={{
          header: () => <PatientHomeHeader />,
        }}
      />
      <PatientHomeTabs onTabChange={onTabChange} tabs={tabs} />
      <ScreenTransition
        key={tab}
        direction={isForward ? "Forward" : "Backward"}
        style={{ flex: 1 }}
      >
        {tabComponents[tab] || <TextRegular>Tab not found</TextRegular>}
      </ScreenTransition>
    </PageScrollView>
  );
};
export default PatientHomeScreen;
