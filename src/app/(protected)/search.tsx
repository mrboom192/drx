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
  const [specialty, setSpecialty] = useState("all");
  const fetchSomeDoctors = useFetchSomeDoctors();

  const onDataChanged = (specialty: string) => {
    setSpecialty(specialty);
  };

  useEffect(() => {
    fetchSomeDoctors();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <DoctorsHeader onSpecialtyChange={onDataChanged} />,
        }}
      />
      {/* <DoctorList specialty={specialty} />
       */}
      <DoctorMap specialty={specialty} />
      <DoctorsBottomSheet specialty={specialty} />
    </View>
  );
};

export default Page;
