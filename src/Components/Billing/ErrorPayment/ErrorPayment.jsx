import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@components'
import { AuthPageHeader } from '@pages'
import s from './ErrorPayment.module.scss'
import * as routes from '@src/routes'
import { parseLang } from '@utils'

export default function Component({ title, text, isSupport = true }) {
  const { t, i18n } = useTranslation(['billing', 'other', 'payers'])
  const navigate = useNavigate()

  const backHandler = () => {
    navigate(routes.BILLING, {
      replace: true,
    })
  }

  const errorTitle = title || t('Payment error')
  const errorText = text || t('payment_error_text')

  return (
    <div className={s.modalBg}>
      <AuthPageHeader onLogoClick={backHandler} />
      <div className={s.modalBlock}>
        <div className={s.modalTopBlock}>
          <Icon name="ErrorPay" />
          <div className={s.error}>{errorTitle}</div>
          <div className={s.errorText}>{errorText}</div>
          {isSupport && (
            <Link className={s.linkSupport} to={routes.SUPPORT}>
              {t('Support service')}
            </Link>
          )}
        </div>

        <div className={s.linksBlock}>
          <a
            className={s.link}
            href={`${process.env.REACT_APP_SITE_URL}/${parseLang(i18n?.language)}${
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
