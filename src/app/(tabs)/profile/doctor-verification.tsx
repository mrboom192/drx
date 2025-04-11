import { SafeAreaView } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const DoctorVerification = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          title: "Verification",
          headerTitleStyle: { fontFamily: "dm-sb" },
          headerTitleAlign: "center",
        }}
      />
    </SafeAreaView>
  );
};

export default DoctorVerification;
