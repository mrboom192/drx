import { StyleSheet, ActivityIndicator, Text } from "react-native";
import { View } from "@/components/Themed";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Stack, useRouter } from "expo-router";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";
import DoctorsHeader from "@/components/DoctorsHeader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DoctorMap from "@/components/DoctorMap";
import DoctorsBottomSheet from "@/components/DoctorsBottomSheet";
import Colors from "@/constants/Colors";
import doctorsData from "@/../assets/data/doctors.json";

const Page = () => {
  const router = useRouter();
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

const styles = StyleSheet.create({
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
