import { Icon } from '@components'
import s from './Error.module.scss'
import { useTranslation } from 'react-i18next'

export default function Error() {
  const { t } = useTranslation('other')

  return (
    <div className={s.wrapper}>
      <Icon name="ErrorPay" />
      <div className={s.error}>{t('error_occured')}</div>
      <div className={s.errorText}>{t('error_text')}</div>
    </div>
  )
}
