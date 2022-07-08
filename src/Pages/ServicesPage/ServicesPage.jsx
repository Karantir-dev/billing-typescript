import React from 'react'
import { useTranslation } from 'react-i18next'

import s from './ServicesPage.module.scss'

export default function ServicesPage({ children }) {
  const { t } = useTranslation(['container', 'trusted_users'])

  // const isComponentAllowedToRender = usePageRender('mainmenuservice')

  return (
    <div className={s.page_wrapper}>
      <h3 className={s.page_title}>{t('aside_menu.services')}</h3>
      {children}
    </div>
  )
}
