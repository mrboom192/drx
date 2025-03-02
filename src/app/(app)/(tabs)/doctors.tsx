import { View, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import { Stack, useRouter } from "expo-router";
import DoctorsHeader from "@/components/Header";
import doctorsData from "@/../assets/data/doctors.json";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DoctorMap from "@/components/DoctorMap";
import DoctorsBottomSheet from "@/components/DoctorsBottomSheet";

const Page = () => {
  const router = useRouter();
  const doctors = useMemo(() => doctorsData as any, []);
  const [specialty, setSpecialty] = useState("General Practice");

  const onDataChanged = (specialty: string) => {
    setSpecialty(specialty);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            header: () => <DoctorsHeader onSpecialtyChange={onDataChanged} />,
          }}
        />
        <DoctorMap doctors={doctors} />
        <DoctorsBottomSheet doctors={doctors} specialty={specialty} />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#660066",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Page;
