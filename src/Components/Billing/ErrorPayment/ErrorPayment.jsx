import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ErrorPay } from '../../../images'
import s from './ErrorPayment.module.scss'
import * as routes from '../../../routes'

export default function Component() {
  const { t } = useTranslation(['billing', 'other', 'payers'])

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <ErrorPay />
        <div className={s.error}>{t('Payment error')}</div>
        <div className={s.errorText}>
          {t(
            'An error occurred while processing the payment. If you have any questions, please contact support.',
          )}
        </div>
        <div className={s.linksBlock}>
          <Link className={s.link} to={routes.SUPPORT}>
            {t('Support service')}
          </Link>
          <div className={s.linkLine} />
          <Link className={s.link} to={routes.BILLING}>
            {t('Back to billing')}
          </Link>
        </div>
      </div>
    </div>
  )
}
