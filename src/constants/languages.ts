import { TFunction } from "i18next";

export const getLanguageOptions = (t: TFunction) => [
  { label: t("languages.english"), value: "en" },
  { label: t("languages.arabic"), value: "ar" },
  { label: t("languages.hindi"), value: "hi" },
];
