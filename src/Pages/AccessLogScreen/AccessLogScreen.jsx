import React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import calendar_dt from '../../images/calendar_dt.svg'
import calendar from '../../images/calendar.svg'
import csv_doc_dt from '../../images/csv_doc_dt.svg'
import csv_doc from '../../images/csv_doc.svg'
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
                <img
                  className={s.icon}
                  src={darkTheme ? calendar_dt : calendar}
                  alt="calendar"
                />
              </button>
            </div>
            <button>
              <img
                className={s.icon}
                src={darkTheme ? csv_doc_dt : csv_doc}
                alt="calendar"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
