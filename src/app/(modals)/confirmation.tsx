import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "@/hooks/useThemeStyles";

const Confirmation = () => {
  const { colorScheme } = useThemedStyles();

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Confirm your number",
          headerTitleStyle: {
            fontFamily: "dm-sb",
          },
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="close-outline"
                size={24}
                color={colorScheme === "light" ? "#000" : "#FFF"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Text>Confirmation</Text>
    </View>
  );
};

export default Confirmation;
