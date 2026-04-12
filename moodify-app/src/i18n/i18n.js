import es from './es.js';
import en from './en.js';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const locales = Localization.getLocales();
const primaryLocale = locales[0];

const languageCode = primaryLocale?.languageCode || 'es';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: languageCode, 
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});