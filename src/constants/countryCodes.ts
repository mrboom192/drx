import { TFunction } from "i18next";

export const getCountryOptions = (t: TFunction) => [
  { label: t("countries.united-states"), value: "us" },
  { label: t("countries.egypt"), value: "eg" },
  { label: t("countries.jordan"), value: "jo" },
  { label: t("countries.india"), value: "in" },
];
