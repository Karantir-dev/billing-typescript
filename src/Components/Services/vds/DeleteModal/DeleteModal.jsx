import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Button } from '../../../'

import s from './DeleteModal.module.scss'

export default function DeleteModal({ closeFn, name, deleteFn }) {
  const { t } = useTranslation(['vds', 'other'])
  return (
    <div className={s.modal}>
      <button className={s.icon_cross} onClick={closeFn} type="button">
        <Cross />
      </button>
      <p className={s.title}>{t('attention')}!</p>
      <p className={s.text}>
        {t('delete_message')} {name}?
      </p>

      <Button
        className={s.cancel_btn}
        onClick={closeFn}
        isShadow
        label={t('Cancel', { ns: 'other' })}
      />

      <button className={s.delete_btn} type="button" onClick={deleteFn}>
        {t('delete', { ns: 'other' })}
      </button>
    </div>
  )
}
