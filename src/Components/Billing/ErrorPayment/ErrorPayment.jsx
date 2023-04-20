import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorPay } from '../../../images'
import { SITE_URL } from '../../../config/config'
import { AuthPageHeader } from '../../../Pages'
import s from './ErrorPayment.module.scss'
import * as routes from '../../../routes'

export default function Component() {
  const { t } = useTranslation(['billing', 'other', 'payers'])
  const navigate = useNavigate()

  const backHandler = () => {
    navigate(routes.BILLING)
  }

  return (
    <div className={s.modalBg}>
      <AuthPageHeader onLogoClick={backHandler} />
      <div className={s.modalBlock}>
        <div className={s.modalTopBlock}>
          <ErrorPay />
          <div className={s.error}>{t('Payment error')}</div>
          <div className={s.errorText}>{t('payment_error_text')}</div>

          <Link className={s.linkSupport} to={routes.SUPPORT}>
            {t('Support service')}
          </Link>
        </div>

        <div className={s.linksBlock}>
          <a className={s.link} href={SITE_URL}>
            {t('Back to site')}
          </a>
          <Link className={s.link} to={routes.BILLING}>
            {t('Back to billing')}
          </Link>
        </div>
      </div>
    </div>
  )
}
