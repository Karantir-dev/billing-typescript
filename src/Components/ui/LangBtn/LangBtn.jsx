import React from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Shevron } from '../../../images/'

import s from './LangBtn.module.scss'

const LANGUAGES = ['en', 'ru', 'kz', 'ua', 'ge']

export default function LangBtn({ burgerType, authType, mainType }) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.slice(0, 5)

  if (!LANGUAGES.includes(currentLang)) {
    i18n.changeLanguage('en')
  }

  const availableLangs = LANGUAGES.filter(lang => currentLang !== lang)

  return (
    <div
      className={cn({
        [s.select_wrapper]: true,
        [s.burger_type]: burgerType,
        [s.auth_type]: authType,
        [s.main_type]: mainType,
      })}
    >
      <div className={s.current_lang}>
        {currentLang}
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

LangBtn.propTypes = {
  burgerType: PropTypes.bool,
  authType: PropTypes.bool,
  mainType: PropTypes.bool,
}