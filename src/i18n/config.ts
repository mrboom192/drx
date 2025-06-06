import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  debug: true,
  lng: "ar",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: require("./en/translations.json"),
    },
    ar: {
      translation: require("./ar/translations.json"),
    },
  },
});
