import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";
import React from "react";

const ProfileLayout = () => {
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
          title: "Personal Info",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="account-info"
        options={{
          title: "Account Info",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen name="medical-record" options={{ headerShown: false }} />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: "Payment Methods",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="patients"
        options={{
          title: "Patients",
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
