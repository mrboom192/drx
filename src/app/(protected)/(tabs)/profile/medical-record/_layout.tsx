import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

const MedicalInformationLayout = () => {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        header: (props) => <PageHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("page.medical-record"),
        }}
      />
      <Stack.Screen
        name="conditions"
        options={{
          title: t("page.diseases-and-conditions"),
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.navigate({
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
          title: t("page.allergies"),
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.navigate({
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
          title: t("page.medications"),
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.navigate({
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
