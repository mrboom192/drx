import { TFunction } from "i18next";

export const getPatientLinks = (t: TFunction) => [
  {
    icon: "person-outline",
    label: t("profile.manage-your-personal-information"),
    url: "/(tabs)/profile/personal",
  },
  {
    icon: "medkit-outline",
    label: t("profile.view-your-medical-record"),
    url: "/(tabs)/profile/medical-record",
  },
  // {
  //   icon: "card-outline",
  //   label: "Payment methods",
  //   url: "/(tabs)/profile/payment-methods",
  // },
  {
    icon: "shield-checkmark-outline",
    label: t("profile.view-our-apps-privacy-policy"),
    url: "/privacy-policy",
  },
  {
    icon: "information-circle-outline",
    label: t("profile.view-our-apps-terms-of-service"),
    url: "/terms-of-service",
  },
];

export const getDoctorLinks = (t: TFunction) => [
  {
    icon: "person-outline",
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
    icon: "shield-checkmark-outline",
    label: t("profile.view-our-apps-privacy-policy"),
    url: "/privacy-policy",
  },
  {
    icon: "information-circle-outline",
    label: t("profile.view-our-apps-terms-of-service"),
    url: "/terms-of-service",
  },
];
