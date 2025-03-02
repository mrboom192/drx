import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Doctor } from "@/types/doctor";
import doctorsData from "@/../assets/data/doctors.json";
import { themedStyles } from "@/constants/Styles";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const doctor: Doctor = (doctorsData as any[]).find((item) => item.id === id);

  const themeBorderStyle =
    colorScheme === "light"
      ? themedStyles.lightBorder
      : themedStyles.darkBorder;

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : themedStyles.darkTextPrimary;

  const themeTextStyleSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : themedStyles.darkTextSecondary;

  return (
    <View>
      <Stack.Screen
        options={
          {
            //   header: () => <DoctorsHeader onSpecialtyChange={onDataChanged} />,
          }
        }
      />
      <Text style={themeTextStylePrimary}>{doctor.name}</Text>
    </View>
  );
};

export default Page;
