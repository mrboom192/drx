import { TFunction } from "i18next";

export const getFilterMap = (t: TFunction) => ({
  fallback: {
    title: t("symptoms.error.title"),
    description: t("symptoms.error.description"),
    image: null,
    key: null,
    filters: [],
  },
  us: {
    title: t("home.american-doctors"),
    description: t("symptoms.doctors-licensed-in-the-us"),
    image: undefined,
    key: "countries",
    filters: ["us"],
  },
  sa: {
    title: t("home.arabic-doctors"),
    description: t("symptoms.doctors-licensed-in-arabic-countries"),
    image: undefined,
    key: "countries",
    filters: ["eg", "jo"],
  },
  in: {
    title: t("home.indian-doctors"),
    description: t("symptoms.doctors-licensed-in-india"),
    image: undefined,
    key: "countries",
    filters: ["in"],
  },
  diarrhea: {
    title: t("symptoms.diarrhea"),
    description: t("symptoms.doctors-who-treat-the-symptoms-of-diarrhea"),
    image: require("@/../assets/images/symptoms/diarrhea.png"),
    key: "specializations",
    filters: ["gastroenterology", "internal medicine", "family medicine"],
  },
  acne: {
    title: t("symptoms.acne"),
    description: t("symptoms.doctors-who-treat-acne-and-skin-conditions"),
    image: require("@/../assets/images/symptoms/acne.png"),
    key: "specializations",
    filters: ["general practice", "dermatology", "family medicine"],
  },
  heart: {
    title: t("symptoms.heart-conditions"),
    description: t("symptoms.doctors-specializing-in-heart-health"),
    image: require("@/../assets/images/symptoms/heart.png"),
    key: "specializations",
    filters: ["cardiology", "internal medicine", "family medicine"],
  },
  allergies: {
    title: t("symptoms.allergies"),
    description: t(
      "symptoms.doctors-who-treat-allergies-and-related-conditions"
    ),
    image: require("@/../assets/images/symptoms/allergies.png"),
    key: "specializations",
    filters: ["allergy and immunology", "family medicine"],
  },
  depression: {
    title: t("symptoms.depression"),
    description: t(
      "symptoms.doctors-who-specialize-in-mental-health-and-depression"
    ),
    image: require("@/../assets/images/symptoms/depression.png"),
    key: "specializations",
    filters: ["psychiatry", "family medicine"],
  },
  uti: {
    title: t("symptoms.uti"),
    description: t("symptoms.doctors-who-treat-urinary-tract-infections"),
    image: require("@/../assets/images/symptoms/uti.png"),
    key: "specializations",
    filters: ["urology", "internal medicine", "family medicine"],
  },
});
