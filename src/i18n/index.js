import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";
import it from "./locales/it/translation.json";
import pt from "./locales/pt/translation.json";
import ko from "./locales/ko/translation.json";

const idiomaActual = localStorage.getItem("i18nextLng") || "es";

i18next.use(initReactI18next).init({
  lng: idiomaActual,
  fallbackLng: "es",
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
    de: {
        translation: de,
    },
    fr: {
        translation: fr,
    },
    it: {
        translation: it,
    },
    pt: {
        translation: pt,
    },
    ko: {
        translation: ko,
    }
  },
  interpolation: {
    escapeValue: false,
  },
});

i18next.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng);
});

export default i18next;
