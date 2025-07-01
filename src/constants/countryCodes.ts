import { TFunction } from "i18next";

export const getCountryOptions = (t: TFunction) => [
  { label: t("countries.united-states"), value: "us" },
  { label: t("countries.egypt"), value: "eg" },
  { label: t("countries.jordan"), value: "jo" },
  { label: t("countries.india"), value: "in" },
  { label: t("countries.france"), value: "fr" },
  { label: t("countries.germany"), value: "de" },
  { label: t("countries.greece"), value: "gr" },
  { label: t("countries.hungary"), value: "hu" },
  { label: t("countries.iceland"), value: "is" },
  { label: t("countries.ireland"), value: "ie" },
  { label: t("countries.italy"), value: "it" },
  { label: t("countries.kosovo"), value: "xk" },
  { label: t("countries.spain"), value: "es" },
  { label: t("countries.sweden"), value: "se" },
  { label: t("countries.switzerland"), value: "ch" },
  { label: t("countries.united-kingdom"), value: "gb" },
];
