import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const DoctorProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        title: "Booking",
        headerTitleStyle: { fontFamily: "dm-sb" },
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{ title: "Doctor Profile", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="booking"
        options={{
          title: "Book Consultation",
          headerTitleAlign: "center",
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default DoctorProfileLayout;
