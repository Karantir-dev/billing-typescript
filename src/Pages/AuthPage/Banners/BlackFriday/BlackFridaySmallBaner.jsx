import React from 'react'
import GiftIcon from './GiftIcon'
import PumpkinsText from './PumpkinsText'
import { useTranslation } from 'react-i18next'

import s from '../../AuthPage.module.scss'

export default function Component() {
  const { t } = useTranslation('other')

  return (
    <>
      <GiftIcon />
      <PumpkinsText className={s.pumpkinsTextIcon} />
      <div className={s.pumpkinsText}>
        <div>{t('discounts_up_to', { amount: '-90%' })}</div>
        <div>{t('halloween_discount')}</div>
      </div>
    </>
  )
}
