import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

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
