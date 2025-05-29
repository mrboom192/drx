import PageListLink from "@/components/PageListLink";
import PageScrollView from "@/components/PageScrollView";
import { TextSemiBold } from "@/components/StyledText";
import {
  useIsFetchingMedicalRecords,
  useStartRecordsListener,
} from "@/stores/useRecordStore";
import { RelativePathString } from "expo-router";
import React, { useEffect } from "react";

const pages = [
  {
    title: "Allergies",
    description: "Manage your allergies and intolerances.",
    href: "/(protected)/(tabs)/profile/medical-record/allergies",
  },
  {
    title: "Medications",
    description: "View and manage your current medications.",
    href: "/(protected)/(tabs)/profile/medical-record/medications",
  },
  {
    title: "Diseases & Conditions",
    description: "View and manage your diseases and conditions.",
    href: "/(protected)/(tabs)/profile/medical-record/conditions",
  },
];

const MedicalInfo = () => {
  const startRecordsListener = useStartRecordsListener();
  const isFetchingRecords = useIsFetchingMedicalRecords();

  useEffect(() => {
    startRecordsListener();
  }, []);

  if (isFetchingRecords) {
    return (
      <PageScrollView>
        <TextSemiBold>Loading...</TextSemiBold>
      </PageScrollView>
    );
  }

  return (
    <PageScrollView style={{ paddingVertical: 0 }}>
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
