import { IconProperties, PageListLinkProps } from "@/components/PageListLink";
import { TFunction } from "i18next";
import Colors from "./Colors";
import { VerificationStatus } from "@/types/user";

export const getMedicalRecordPages = (t: TFunction): PageListLinkProps[] => [
  {
    title: t("symptoms.allergies"),
    description: t("record.manage-your-allergies-and-intolerances"),
    href: "/(protected)/(tabs)/profile/medical-record/allergies",
  },
  {
    title: t("common.medications"),
    description: t("record.view-and-manage-your-current-medications"),
    href: "/(protected)/(tabs)/profile/medical-record/medications",
  },
  {
    title: t("record.diseases-and-conditions"),
    description: t("record.view-and-manage-your-diseases-and-conditions"),
    href: "/(protected)/(tabs)/profile/medical-record/conditions",
  },
];

export const getPatientPersonalInfoPages = (
  t: TFunction
): PageListLinkProps[] => [
  {
    title: t("page.account-info"),
    description: t("page.manage-your-personal-account-information"),
    href: "/(protected)/(tabs)/profile/account-info",
  },
];

export const getDoctorPersonalInfoPages = (
  t: TFunction,
  hasPublicProfile: boolean | undefined,
  verification: VerificationStatus | undefined
): PageListLinkProps[] => {
  const publicProfileIcon: IconProperties = {
    name: hasPublicProfile ? "schedule" : "check-circle",
    color: hasPublicProfile ? Colors.onlineConsultation : Colors.green,
  };

  const verificationIcon: IconProperties = {
    name: verification === "verified" ? "check-circle" : "error",
    color: verification === "verified" ? Colors.green : Colors.pink,
  };

  return [
    {
      title: t("page.account-info"),
      description: t("page.manage-your-personal-account-information"),
      href: "/(protected)/(tabs)/profile/account-info",
    },
    {
      title: t("page.public-profile"),
      description: t(
        "page.manage-your-public-facing-profile-which-will-be-visible-to-patients"
      ),
      href: "/(protected)/(modals)/update-public-profile",
      icon: publicProfileIcon,
    },
    {
      title: t("page.verification"),
      description: t(
        "page.verify-your-doctor-account-in-order-for-you-to-be-visible-to-patients"
      ),
      href: "/(protected)/(modals)/doctor-verification",
      icon: verificationIcon,
    },
  ];
};
