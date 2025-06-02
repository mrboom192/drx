import { Stack } from "expo-router";
import React from "react";
import PageScrollView from "../PageScrollView";
import { PatientHomeHeader } from "../PatientHomeHeader";
import Footer from "./patient/Footer";
import InternationalDoctors from "./patient/InternationalDoctors";
import PatientActions from "./patient/PatientActions";
import Services from "./patient/Services";
import Symptoms from "./patient/Symptoms";

const PatientHomeScreen = () => {
  return (
    <PageScrollView showsVerticalScrollIndicator={false} style={{ padding: 0 }}>
      <Stack.Screen
        options={{
          header: () => <PatientHomeHeader />,
        }}
      />
      <Symptoms />
      <Services />
      <InternationalDoctors />
      <PatientActions />
      <Footer />
    </PageScrollView>
  );
};
export default PatientHomeScreen;
