import { Text } from "react-native";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import PatientHomeScreen from "@/components/screens/PatientHomeScreen";
import DoctorHomeScreen from "@/components/screens/DoctorHomeScreen";

const Home = () => {
  const { data, loading } = useUser();

  if (loading) return <Text>Loading...</Text>;

  return data?.role === "doctor" ? <DoctorHomeScreen /> : <PatientHomeScreen />;
};

export default Home;
