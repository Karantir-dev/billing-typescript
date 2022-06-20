import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Button } from '../../../'

import s from './IPeditModal.module.scss'

export default function IPeditModal({ closeFn, name }) {
  const { t } = useTranslation(['vds', 'other'])

  return (
    <div className={s.modal}>
      <button className={s.icon_cross} onClick={closeFn} type="button">
        <Cross />
      </button>

      <p className={s.title}>
        <span className={s.bold}>
          {t('ip_address')} — {name.split('(')[0]}
        </span>
        {'(' + name.split('(')[1]}
      </p>

      <Button
        className={s.cancel_btn}
        onClick={closeFn}
        isShadow
        label={t('Save', { ns: 'other' })}
      />

      <button className={s.delete_btn} type="button" onClick={closeFn}>
        {t('Cancel', { ns: 'other' })}
      </button>
    </div>
  )
}
