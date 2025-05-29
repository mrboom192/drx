import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";
import { router, Stack } from "expo-router";
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
        name="conditions"
        options={{
          title: "Diseases & Conditions",
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.push({
                  pathname: "/(protected)/(modals)/update-condition",
                  params: { mode: "add", medicationId: "" },
                })
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="allergies"
        options={{
          title: "Allergies",
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.push({
                  pathname: "/(protected)/(modals)/update-allergy",
                  params: { mode: "add", medicationId: "" },
                })
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="medications"
        options={{
          title: "Medications",
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.push({
                  pathname: "/(protected)/(modals)/update-medication",
                  params: { mode: "add", medicationId: "" },
                })
              }
            />
          ),
        }}
      />
    </Stack>
  );
};

export default MedicalInformationLayout;
