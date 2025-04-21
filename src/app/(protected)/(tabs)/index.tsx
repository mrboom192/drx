import { Text } from "react-native";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import PatientHomeScreen from "@/components/screens/PatientHomeScreen";
import DoctorHomeScreen from "@/components/screens/DoctorHomeScreen";
import { TextRegular } from "@/components/StyledText";

const Home = () => {
  const { data, loading } = useUser();

  if (loading) return <TextRegular>Loading...</TextRegular>;

  return data?.role === "doctor" ? <DoctorHomeScreen /> : <PatientHomeScreen />;
};

export default Home;
