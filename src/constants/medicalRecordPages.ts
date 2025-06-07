import { TFunction } from "i18next";

export const getPages = (t: TFunction) => [
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
