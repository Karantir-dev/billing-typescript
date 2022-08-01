import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Button } from '../../../'
import PropTypes from 'prop-types'

import s from './DeleteModal.module.scss'

export default function DeleteModal({ closeFn, names, deleteFn }) {
  const { t } = useTranslation(['vds', 'other'])

  const namesToRender = names.length > 3 ? names.slice(0, 3) : names

  return (
    <div className={s.modal}>
      <button className={s.icon_cross} onClick={closeFn} type="button">
        <Cross />
      </button>
      <p className={s.title}>{t('attention')}!</p>
      <p className={s.text}>{t('delete_message')}:</p>

      {namesToRender.map((item, idx) => {
        return (
          <p className={s.item} key={item}>
            {item}
            {names.length <= 3 && idx === names.length - 1 ? '?' : ','}
          </p>
        )
      })}
      {names.length > 3 && (
        <p>{t('services_deletion', { ns: 'other', value: +names.length - 3 })}</p>
      )}

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

DeleteModal.propTypes = {
  names: PropTypes.array.isRequired,
  closeFn: PropTypes.func.isRequired,
  deleteFn: PropTypes.func.isRequired,
}
