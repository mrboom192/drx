import { TFunction } from "i18next";

export const getCountryOptions = (t: TFunction) => [
  { label: t("countries.united-states"), value: "us" },
  { label: t("countries.egypt"), value: "eg" },
  { label: t("countries.jordan"), value: "jo" },
  { label: t("countries.india"), value: "in" },
  { label: "France 🇫🇷", value: "fr" },
  { label: "Germany 🇩🇪", value: "de" },
  { label: "Greece 🇬🇷", value: "gr" },
  { label: "Hungary 🇭🇺", value: "hu" },
  { label: "Iceland 🇮🇸", value: "is" },
  { label: "Ireland 🇮🇪", value: "ie" },
  { label: "Italy 🇮🇹", value: "it" },
  { label: "Kosovo 🇽🇰", value: "xk" },
  { label: "Spain 🇪🇸", value: "es" },
  { label: "Sweden 🇸🇪", value: "se" },
  { label: "Switzerland 🇨🇭", value: "ch" },
  { label: "United Kingdom 🇬🇧", value: "gb" },
];
