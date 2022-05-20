import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePageRender } from '../../utils'

import s from './ServicesPage.module.scss'

export default function ServicesPage({ children }) {
  const { t } = useTranslation(['container', 'trusted_users'])

  const isComponentAllowedToRender = usePageRender('mainmenuservice')

  useEffect(() => {
    if (!isComponentAllowedToRender) {
      toast.error(t('insufficient_rights', { ns: 'trusted_users' }), {
        position: 'bottom-right',
      })
    }
  }, [])

  return (
    <div className={s.page_wrapper}>
      <h3 className={s.page_title}>{t('aside_menu.services')}</h3>
      {children}
    </div>
  )
}
