import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import * as Localization from "expo-localization";

const deviceLang = Localization.getLocales()[0];
const deviceLangCode =
  deviceLang.languageTag || deviceLang.languageCode || "en";

i18next.use(initReactI18next).init({
  debug: true,
  lng: deviceLangCode,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
});
