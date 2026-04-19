import es from './es.js';
import en from './en.js';
import ca from './ca.js';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const locales = Localization.getLocales();
const languageCode = locales[0]?.languageCode || 'es';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', 
    resources: {
      en: { translation: en },
      es: { translation: es },
      ca: { translation: ca },
    },
    lng: languageCode, 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;