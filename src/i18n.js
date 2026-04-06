import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импорт переводов
import en from './locales/en.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';
import ky from './locales/ky.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  tr: { translation: tr },
  zh: { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar },
  ky: { translation: ky },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en', // язык по умолчанию из localStorage
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Сохранять язык в localStorage при изменении
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  // Установить направление текста для RTL языков
  const direction = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
});

export default i18n;