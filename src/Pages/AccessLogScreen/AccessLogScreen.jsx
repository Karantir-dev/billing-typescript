import React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { CsvDoc, Calendar } from '../../images'
import { ThemeBtn, LangBtn } from '../../Components/'
import s from './AccessLogScreen.module.scss'

export default function MainPage() {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const { t } = useTranslation('access_log')

  return (
    <div className={cn({ [s.wrapper]: true, [s.dt]: darkTheme })}>
      <div className={s.header}>
        <div className={`container ${s.flex}`}>
          <div className={s.btns_wrapper}>
            <ThemeBtn />
            <LangBtn />
          </div>
        </div>
      </div>
      <div className={s.body}>
        <div className={s.menu} />
        <div className={s.content}>
          <h1 className={s.pageTitle}>{t('access_log')}</h1>
          <div className={s.filterBlock}>
            <div>
              <input placeholder="Удалённый IP-адрес" />
              <input placeholder="За все время" />
              <button>
                <Calendar darktheme={darkTheme ? 1 : 0} />
              </button>
            </div>
            <button>
              <CsvDoc darktheme={darkTheme ? 1 : 0} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
