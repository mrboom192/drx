import DoctorList from "@/components/DoctorList";
import DoctorsHeader from "@/components/DoctorsHeader";
import { View } from "@/components/Themed";
import { useFetchSomeDoctors } from "@/stores/useDoctorSearch";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";

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
      <DoctorList specialty={specialty} />
    </View>
  );
};

export default Page;
