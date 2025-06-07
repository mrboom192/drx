import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

const DoctorProfileLayout = () => {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ header: (props) => <PageHeader {...props} /> }}>
      <Stack.Screen name="[id]" options={{ title: t("page.doctor-profile") }} />
      <Stack.Screen
        name="booking"
        options={{
          title: t("page.book-consultation"),
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default DoctorProfileLayout;
