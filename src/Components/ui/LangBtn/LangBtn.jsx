import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from '@components'
import { actions, settingsOperations, userSelectors } from '@redux'
import { useDispatch, useSelector } from 'react-redux'

import s from './LangBtn.module.scss'

import ukraine_lang from '@images/lang/ukraine_lang.svg'
import uk_lang from '@images/lang/uk_lang.svg'
import goblin_lang from '@images/lang/russia_lang.svg'

// const LANGUAGES = ['en', 'kk', 'uk', 'ka', 'ru']
const LANGUAGES = [
  {
    langCode: 'uk',
    showLangCode: 'ua',
    name: 'Ukrainian',
    flag: ukraine_lang,
  },
  {
    langCode: 'en',
    showLangCode: 'en',
    name: 'English',
    flag: uk_lang,
  },
  {
    langCode: 'ru',
    showLangCode: 'ru',
    name: 'Russian',
    flag: goblin_lang,
  },
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
        <img src={langCodeForWeb?.flag} alt="country flag" />
        {checkIfLangIsLocale
          ? langCodeForWeb?.showLangCode?.split('-')[0]
          : langCodeForWeb?.showLangCode}
        <Icon name="Shevron" className={s.icon} />
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
                  <img src={lang?.flag} alt="country flag" />
                  {`${lang.showLangCode} (${lang.name})`}
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
