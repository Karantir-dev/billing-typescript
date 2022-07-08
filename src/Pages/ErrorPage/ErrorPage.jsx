import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Error404_dt, Error404_lt } from '../../images'
import { selectors } from '../../Redux'

import s from './ErrorPage.module.scss'

export default function ErrorPage() {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const { t } = useTranslation('other')

  return (
    <div className={s.error_page}>
      <p className={s.error_type}>404</p>
      <p className={s.error_title}>{t('error_type').toUpperCase()}</p>
      <p className={s.error_text}>{t('error_text')}</p>
      {darkTheme ? (
        <Error404_dt className={s.error_img} svgwidth="200" svgheight="141" />
      ) : (
        <Error404_lt className={s.error_img} svgwidth="200" svgheight="141" />
      )}
    </div>
  )
}
