import { Stack } from "expo-router";
import React from "react";

const DoctorProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        title: "Booking",
        headerTitleStyle: { fontFamily: "dm-sb" },
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    />
  );
};

export default DoctorProfileLayout;
