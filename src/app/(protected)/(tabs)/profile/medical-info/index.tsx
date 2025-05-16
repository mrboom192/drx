import PageListLink from "@/components/PageListLink";
import PageScrollView from "@/components/PageScrollView";
import { RelativePathString } from "expo-router";
import React from "react";

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
    href: "/(protected)/(tabs)/profile/medical-info/medications",
  },
];

const MedicalInfo = () => {
  return (
    <PageScrollView>
      {pages.map((page, idx) => (
        <PageListLink
          key={idx}
          title={page.title}
          description={page.description}
          href={page.href as RelativePathString}
        />
      ))}
    </PageScrollView>
  );
};

export default MedicalInfo;
