import { Icon } from '@components'
import { useTranslation } from 'react-i18next'
import * as route from '../../routes'
import { Link } from 'react-router-dom'
import { useAnalyticsSender } from '@utils'

import s from './PaymentProcessingPage.module.scss'

export default function PaymentSaved() {
  const { t } = useTranslation('other')

  useAnalyticsSender()

  return (
    <div className={s.wrapper}>
      <Icon name="PaymentProcessing" color={'var(--accent-color-light)'} />
      <p className={s.message}>{t('payment_processed')}</p>
      <Link className={s.link} to={route.BILLING}>
        {t('Finance/Accounts')}
      </Link>
    </div>
  )
}
