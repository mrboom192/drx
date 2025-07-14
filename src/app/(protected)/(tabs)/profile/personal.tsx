import PageListLink from "@/components/PageListLink";
import PageScrollView from "@/components/PageScrollView";
import {
  getDoctorPersonalInfoPages,
  getPatientPersonalInfoPages,
} from "@/constants/options";
import { useUserData } from "@/stores/useUserStore";
import { RelativePathString } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

const Personal = () => {
  const { t } = useTranslation();
  const userData = useUserData();
  const pages =
    userData?.role === "patient"
      ? getPatientPersonalInfoPages(t)
      : getDoctorPersonalInfoPages(
          t,
          userData?.hasPublicProfile,
          userData?.verification
        );

  return (
    <PageScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
      {pages.map((page, idx) => (
        <PageListLink
          key={idx}
          title={page.title}
          description={page.description}
          href={page.href as RelativePathString}
          icon={page.icon}
        />
      ))}
    </PageScrollView>
  );
};

export default Personal;
