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
        name="medications"
        options={{
          title: "Medications",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add",
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default MedicalInformationLayout;
