import React from 'react'
import { useTranslation } from 'react-i18next'

import { Shevron } from '../../images/'

import s from './LangBtn.module.scss'

const LANGUAGES = ['en', 'ru', 'kz']

export default function LangBtn() {
  const { i18n } = useTranslation()

  const availableLangs = LANGUAGES.filter(lang => i18n.language !== lang)

  return (
    <div className={s.select_wrapper}>
      <div className={s.current_lang}>
        {i18n.language}
        <Shevron className={s.icon} />
      </div>

      <div className={s.lang_dropdown}>
        <ul className={s.dropdown_list}>
          <li className={s.shevron_wrapper}>
            <div className={s.dropdown_shevron}></div>
          </li>
          {availableLangs.map(lang => {
            return (
              <li key={lang} className={s.lang_item}>
                <button
                  className={s.lang_btn}
                  type="button"
                  onClick={() => i18n.changeLanguage(lang)}
                >
                  {lang}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
