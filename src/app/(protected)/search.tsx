import { View } from "@/components/Themed";
import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import DoctorsHeader from "@/components/DoctorsHeader";
import DoctorMap from "@/components/DoctorMap";
import DoctorsBottomSheet from "@/components/DoctorsBottomSheet";
import doctorsData from "@/../assets/data/doctors.json";

const Page = () => {
  const doctors = useMemo(() => doctorsData as any, []);
  const [specialty, setSpecialty] = useState("General Practice");

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
      <DoctorMap doctors={doctors} />
      <DoctorsBottomSheet doctors={doctors} specialty={specialty} />
    </View>
  );
};

export default Page;
