import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SuccessPay } from '../../../images'
import * as routes from '../../../routes'
import s from './SuccessPayment.module.scss'

export default function Component() {
  const { t } = useTranslation(['billing', 'other'])

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <SuccessPay />
        <div className={s.approved}>{t('Payment approved')}</div>
        <div className={s.completed}>{t('Payment was completed successfully')}</div>
        <Link className={s.link} to={routes.BILLING}>
          {t('Back to billing')}
        </Link>
      </div>
    </div>
  )
}
