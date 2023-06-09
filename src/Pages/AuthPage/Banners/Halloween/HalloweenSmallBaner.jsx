import Pumpkins from './Pumpkins'
import PumpkinsText from './PumpkinsText'
import { useTranslation } from 'react-i18next'

import s from '../../AuthPage.module.scss'

export default function Component() {
  const { t } = useTranslation('other')

  return (
    <>
      <Pumpkins />
      <PumpkinsText className={s.pumpkinsTextIcon} />
      <div className={s.pumpkinsText}>
        <div>{t('discounts_up_to', { amount: '-70%' })}</div>
        <div>{t('halloween_discount')}</div>
      </div>
    </>
  )
}
