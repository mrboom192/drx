import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import DoctorsHeader from "@/components/Header";
import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import doctors from "@/../assets/data/doctors.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DoctorMap from "@/components/DoctorMap";
import DoctorsBottomSheet from "@/components/DoctorsBottomSheet";

const Page = () => {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("General Practice");

  const onDataChanged = (specialty: string) => {
    setSpecialty(specialty);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{ flex: 1, marginTop: 60 }}>
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
