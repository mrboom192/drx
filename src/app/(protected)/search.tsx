import DoctorList from "@/components/DoctorList/DoctorList";
import DoctorMap from "@/components/DoctorMap";
import DoctorsBottomSheet from "@/components/DoctorsBottomSheet";
import DoctorsHeader from "@/components/DoctorsHeader";
import { TextRegular } from "@/components/StyledText";
import { useFetchSomeDoctors } from "@/stores/useDoctorSearch";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

const Page = () => {
  const fetchSomeDoctors = useFetchSomeDoctors();

  useEffect(() => {
    fetchSomeDoctors();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <DoctorsHeader />,
        }}
      />
      <DoctorMap />
      <DoctorsBottomSheet />
    </View>
  );
};

export default Page;
