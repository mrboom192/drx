import { TFunction } from "i18next";

export const getPatientLinks = (t: TFunction) => [
  {
    icon: "account-circle",
    label: t("profile.manage-your-personal-information"),
    url: "/(tabs)/profile/personal",
  },
  {
    icon: "medical-information",
    label: t("profile.view-your-medical-record"),
    url: "/(tabs)/profile/medical-record",
  },
  // {
  //   icon: "card-outline",
  //   label: "Payment methods",
  //   url: "/(tabs)/profile/payment-methods",
  // },
  {
    icon: "privacy-tip",
    label: t("profile.view-our-apps-privacy-policy"),
    url: "/privacy-policy",
  },
  {
    icon: "contract",
    label: t("profile.view-our-apps-terms-of-service"),
    url: "/terms-of-service",
  },
  {
    icon: "settings",
    label: t("profile.change-the-app-settings"),
    url: "/(tabs)/profile/settings",
  },
  {
    icon: "support-agent",
    label: t("profile.contact-support"),
    url: "/support",
  },
];

export const getDoctorLinks = (t: TFunction) => [
  {
    icon: "account-circle",
    label: t("profile.manage-your-personal-information"),
    url: "/(tabs)/profile/personal",
  },
  {
    icon: "medical-outline",
    label: t("profile.view-your-patients"),
    url: "/(tabs)/profile/patients",
  },
  // {
  //   icon: "card-outline",
  //   label: "Payment methods",
  //   url: "/(tabs)/profile/payment-methods",
  // },
  {
    icon: "privacy-tip",
    label: t("profile.view-our-apps-privacy-policy"),
    url: "/privacy-policy",
  },
  {
    icon: "contract",
    label: t("profile.view-our-apps-terms-of-service"),
    url: "/terms-of-service",
  },
  {
    icon: "settings",
    label: t("profile.change-the-app-settings"),
    url: "/(tabs)/profile/settings",
  },
  {
    icon: "support-agent",
    label: t("profile.contact-support"),
    url: "/support",
  },
];
