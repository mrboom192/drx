import LoadingScreen from "@/components/LoadingScreen";
import PageListLink from "@/components/PageListLink";
import PageScrollView from "@/components/PageScrollView";
import { getPages } from "@/constants/medicalRecordPages";
import {
  useIsFetchingMedicalRecords,
  useStartRecordsListener,
} from "@/stores/useRecordStore";
import { RelativePathString } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const MedicalInfo = () => {
  const { t } = useTranslation();
  const pages = useMemo(() => getPages(t), [t]);
  const startRecordsListener = useStartRecordsListener();
  const isFetchingRecords = useIsFetchingMedicalRecords();

  useEffect(() => {
    startRecordsListener();
  }, []);

  if (isFetchingRecords) <LoadingScreen />;

  return (
    <PageScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
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
