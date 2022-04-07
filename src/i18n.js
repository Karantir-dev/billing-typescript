import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
  // Подключение бэкенда i18next
  .use(Backend)
  // Автоматическое определение языка
  .use(LanguageDetector)
  // модуль инициализации
  .use(initReactI18next)
  .init({
    ns: ['auth'],
    // Стандартный язык
    fallbackLng: 'en',
    debug: false,
    // Распознавание и кэширование языковых кук
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      cache: ['localStorage'],
    },
  })

// i18n.services.formatter.add('uppercase', value => {
//   return value.toUpperCase()
// })

i18n.loadNamespaces(['other', 'access_log'])

export default i18n
