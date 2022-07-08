import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Button } from '../../..'

import s from './RebootModal.module.scss'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../../Redux'

export default function RebootModal({ id, name, closeFn }) {
  const { t } = useTranslation(['vds', 'dedicated_servers', 'other'])
  const dispatch = useDispatch()

  const onRebootServer = () => {
    dispatch(vdsOperations.rebootServer(id))
    closeFn()
  }

  return (
    <div className={s.modal}>
      <button className={s.icon_cross} onClick={closeFn} type="button">
        <Cross />
      </button>

      <p className={s.title}>{t('reload')}</p>
      <p className={s.text}>
        {t('Are you sure you want to restart the server', { ns: 'dedicated_servers' })}{' '}
        {name}?
      </p>

      <Button
        className={s.btn_save}
        onClick={onRebootServer}
        isShadow
        label={t('ok', { ns: 'other' })}
      />

      <button className={s.btn_cancel} onClick={closeFn} type="button">
        {t('Cancel', { ns: 'other' })}
      </button>
    </div>
  )
}
