import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@components'
import { SITE_URL } from '@config/config'
import { AuthPageHeader } from '@pages'
import s from './ErrorPayment.module.scss'
import * as routes from '@src/routes'
import { parseLang } from '@utils'

export default function Component() {
  const { t, i18n } = useTranslation(['billing', 'other', 'payers'])
  const navigate = useNavigate()

  const backHandler = () => {
    navigate(routes.BILLING)
  }

  return (
    <div className={s.modalBg}>
      <AuthPageHeader onLogoClick={backHandler} />
      <div className={s.modalBlock}>
        <div className={s.modalTopBlock}>
          <Icon name="ErrorPay" />
          <div className={s.error}>{t('Payment error')}</div>
          <div className={s.errorText}>{t('payment_error_text')}</div>

          <Link className={s.linkSupport} to={routes.SUPPORT}>
            {t('Support service')}
          </Link>
        </div>

        <div className={s.linksBlock}>
          <a
            className={s.link}
            href={`${SITE_URL}/${parseLang(i18n?.language)}${
              i18n?.language !== 'en' ? '/' : ''
            }`}
          >
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
