import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

const ProfileLayout = () => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="personal"
        options={{
          title: t("page.personal-info"),
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="account-info"
        options={{
          title: t("page.account-info"),
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen name="medical-record" options={{ headerShown: false }} />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: t("page.payment-methods"),
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="patients"
        options={{
          title: t("page.patients"),
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
