import { TFunction } from "i18next";

export const getDoctorCountries = (t: TFunction) => [
  {
    name: t("home.american-doctors"),
    image: require("@/../assets/images/countries/us.png"),
    backgroundColor: "#FFD79F",
    filter: "us",
  },
  {
    name: t("home.arabic-doctors"),
    image: require("@/../assets/images/countries/sa.png"),
    backgroundColor: "#F4BCFF",
    filter: "sa",
  },
  {
    name: t("home.indian-doctors"),
    image: require("@/../assets/images/countries/in.png"),
    backgroundColor: "#FFBCBD",
    filter: "in",
  },
  {
    name: t("home.european-doctors"),
    image: require("@/../assets/images/countries/eu.png"),
    backgroundColor: "#CDEAFB",
    filter: "eu",
  },
];
