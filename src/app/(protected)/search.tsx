import DoctorList from "@/components/DoctorList";
import DoctorsHeader from "@/components/DoctorsHeader";
import { View } from "@/components/Themed";
import { Stack } from "expo-router";
import React, { useState } from "react";

const Page = () => {
  const [specialty, setSpecialty] = useState("all");

  const onDataChanged = (specialty: string) => {
    setSpecialty(specialty);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <DoctorsHeader onSpecialtyChange={onDataChanged} />,
        }}
      />
      {/* <DoctorMap doctors={doctors} /> */}
      {/* <DoctorsBottomSheet doctors={doctors} specialty={specialty} /> */}
      <DoctorList specialty={specialty} />
    </View>
  );
};

export default Page;
