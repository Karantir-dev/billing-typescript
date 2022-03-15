import React from 'react'
import { useTranslation } from 'react-i18next'

import s from './LangBtn.module.scss'

export function LangBtn() {
  const { i18n } = useTranslation()

  return (
    <div className={s.btn_wrapper}>
      <button
        className={s.btn}
        type="button"
        disabled={i18n.language === 'en' || i18n.language === 'en-EN'}
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </button>

      <button
        className={s.btn}
        type="button"
        disabled={i18n.language === 'ru' || i18n.language === 'ru-RU'}
        onClick={() => i18n.changeLanguage('ru')}
      >
        RU
      </button>
    </div>
  )
}
