import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";
import React from "react";

const MedicalInformationLayout = () => {
  return (
    <Stack
      screenOptions={{
        header: (props) => <PageHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Medical Info",
        }}
      />
      <Stack.Screen
        name="general"
        options={{
          title: "General Information",
        }}
      />
    </Stack>
  );
};

export default MedicalInformationLayout;
