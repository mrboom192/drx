import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";
import React from "react";

const DoctorProfileLayout = () => {
  return (
    <Stack screenOptions={{ header: (props) => <PageHeader {...props} /> }}>
      <Stack.Screen name="[id]" options={{ title: "Doctor Profile" }} />
      <Stack.Screen
        name="booking"
        options={{
          title: "Book Consultation",
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default DoctorProfileLayout;
