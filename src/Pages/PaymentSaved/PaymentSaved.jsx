import s from './PaymentSaved.module.scss'
import { Icon } from '@components'
import { useTranslation } from 'react-i18next'
import * as route from '@src/routes'
import { Link } from 'react-router-dom'
export default function PaymentSaved() {
  const { t } = useTranslation()

  return (
    <div className={s.wrapper}>
      <Icon name="SuccessPay" color={'var(--accent-color-light)'} />
      <p className={s.message}>{t('payment_saved')}</p>
      <Link className={s.link} to={route.SERVICES}>
        {t('Close')}
      </Link>
    </div>
  )
}
