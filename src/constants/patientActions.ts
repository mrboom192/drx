import { Href } from "expo-router";
import { TFunction } from "i18next";

export const getPatientActions = (t: TFunction) => [
  {
    name: t("actions.find-a-provider"),
    description: t("actions.browse-and-choose-the-perfect-doctor"),
    icon: "stethoscope",
    href: "/search" as Href,
  },
  {
    name: t("actions.update-your-medical-record"),
    description: t("actions.an-up-to-date-record-is-recommended"),
    icon: "ecg-heart",
    href: "/(tabs)/profile/medical-record" as Href,
  },
  // {
  //   name: t("actions.view-your-cases"),
  //   description: t("actions.browse-your-pending-cases"),
  //   icon: "library-books",
  //   href: "/search" as Href,
  // },
];
