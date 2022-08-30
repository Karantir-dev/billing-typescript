import React from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Shevron } from '../../../images/'
import { actions, settingsOperations, userSelectors } from '../../../Redux'
import { useDispatch, useSelector } from 'react-redux'

import s from './LangBtn.module.scss'

// const LANGUAGES = ['en', 'kk', 'uk', 'ka', 'ru']
const LANGUAGES = [
  { langCode: 'uk', showLangCode: 'ua' },
  { langCode: 'en', showLangCode: 'en' },
  { langCode: 'kk', showLangCode: 'kz' },
  { langCode: 'ka', showLangCode: 'ge' },
  { langCode: 'ru', showLangCode: 'ru' },
]

export default function LangBtn({ burgerType, authType, mainType }) {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const currentLang = i18n.language?.slice(0, 5)

  if (!LANGUAGES.some(lang => lang.langCode === currentLang)) {
    i18n.changeLanguage('en')
  }

  const userInfo = useSelector(userSelectors.getUserInfo)

  const availableLangs = LANGUAGES.filter(lang => currentLang !== lang.langCode)
  const langCodeForWeb = LANGUAGES.find(lang => lang.langCode === currentLang)
  const checkIfLangIsLocale = langCodeForWeb?.showLangCode?.split('-')?.length > 1

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
        {checkIfLangIsLocale
          ? langCodeForWeb?.showLangCode?.split('-')[0]
          : langCodeForWeb?.showLangCode}
        <Shevron className={s.icon} />
      </div>

      <div className={s.lang_dropdown}>
        <ul className={s.dropdown_list}>
          <li className={s.shevron_wrapper}>
            <div className={s.dropdown_shevron} />
          </li>
          {availableLangs.map(lang => {
            return (
              <li key={lang.langCode} className={s.lang_item}>
                <button
                  className={s.lang_btn}
                  type="button"
                  onClick={() => {
                    if (userInfo && userInfo?.$id) {
                      dispatch(
                        settingsOperations.changeLang(
                          userInfo?.$id,
                          lang?.showLangCode === 'kz' ? 'kk' : lang?.showLangCode,
                        ),
                      )
                    } else {
                      dispatch(actions.showLoader())
                    }
                    i18n.changeLanguage(lang.langCode)
                  }}
                >
                  {lang.showLangCode}
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
