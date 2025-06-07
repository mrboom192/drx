import { TFunction } from "i18next";

export const getPatientSymptoms = (t: TFunction) => [
  {
    name: t("symptoms.diarrhea"),
    image: require("@/../assets/images/symptoms/diarrhea.png"),
    filter: "diarrhea",
  },
  {
    name: t("symptoms.acne"),
    image: require("@/../assets/images/symptoms/acne.png"),
    filter: "acne",
  },
  {
    name: t("symptoms.heart"),
    image: require("@/../assets/images/symptoms/heart.png"),
    filter: "heart",
  },
  {
    name: t("symptoms.allergies"),
    image: require("@/../assets/images/symptoms/allergies.png"),
    filter: "allergies",
  },
  {
    name: t("symptoms.depression"),
    image: require("@/../assets/images/symptoms/depression.png"),
    filter: "depression",
  },
  {
    name: t("symptoms.uti"),
    image: require("@/../assets/images/symptoms/uti.png"),
    filter: "uti",
  },
];
