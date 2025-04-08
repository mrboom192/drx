import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";

const Personal = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.light.background,
      }}
    >
      <Stack.Screen
        options={{
          title: "Filters",
          headerTitleStyle: {
            fontFamily: "dm-sb",
          },
          presentation: "modal",
        }}
      />
      <Text>Personal information</Text>
    </SafeAreaView>
  );
};

export default Personal;
