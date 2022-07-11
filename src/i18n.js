import i18n, { use } from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Подключение бэкенда i18next
use(Backend)
  // Автоматическое определение языка
  .use(LanguageDetector)
  // модуль инициализации
  .use(initReactI18next)
  .init({
    ns: ['auth'],
    defaultNS: 'other',
    react: {
      wait: true,
      useSuspense: process.env.NODE_ENV === 'test' ? false : true,
    },
    // Стандартный язык
    fallbackLng: 'en',
    debug: false,
    // Распознавание и кэширование языковых кук
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      cache: ['localStorage'],
    },
  })

export default i18n
