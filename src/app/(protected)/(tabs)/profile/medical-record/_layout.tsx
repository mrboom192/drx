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
          title: "Medical Record",
        }}
      />
      <Stack.Screen
        name="general"
        options={{
          title: "General Information",
        }}
      />
      <Stack.Screen
        name="allergies"
        options={{
          title: "Allergies",
        }}
      />
      <Stack.Screen
        name="medications"
        options={{
          title: "Medications",
        }}
      />
    </Stack>
  );
};

export default MedicalInformationLayout;
