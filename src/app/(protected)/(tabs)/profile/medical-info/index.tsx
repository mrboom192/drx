import PageListLink from "@/components/PageListLink";
import { RelativePathString } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const pages = [
  {
    title: "General Information",
    description: "View and update your general medical information.",
    href: "/(protected)/(tabs)/profile/medical-info/general",
  },
  {
    title: "Allergies",
    description: "Manage your allergies and intolerances.",
    href: "/(protected)/(tabs)/profile/medical-info",
  },
  {
    title: "Medications",
    description: "View and manage your current medications.",
    href: "/(protected)/(tabs)/profile/medical-info",
  },
];

const MedicalInfo = () => {
  return (
    <ScrollView style={styles.container}>
      {pages.map((page, idx) => (
        <PageListLink
          key={idx}
          title={page.title}
          description={page.description}
          href={page.href as RelativePathString}
        />
      ))}
    </ScrollView>
  );
};

export default MedicalInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
});
