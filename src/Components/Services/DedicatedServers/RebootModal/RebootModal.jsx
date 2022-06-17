import React from 'react'
import { useTranslation } from 'react-i18next'

import { Cross } from '../../../../images'

import { Button } from '../../..'

import s from './RebootModal.module.scss'
import { useDispatch } from 'react-redux'
import { dedicOperations } from '../../../../Redux'
import classNames from 'classnames'

export default function RebootModal({ elid, closeFn, server }) {
  const { t } = useTranslation(['dedicated_servers', 'other'])

  const dispatch = useDispatch()

  return (
    <div className={s.reboot_modal}>
      <div className={s.header_block}>
        <div className={s.title_wrapper}>
          <h2 className={s.page_title}>{t('Server rebooting')}</h2>
        </div>

        <Cross className={s.icon_cross} onClick={closeFn} width={12} height={12} />
      </div>

      <p>{`${t('Are you sure you want to restart the server')} ${server?.name?.$}`}</p>

      <div className={s.btns_wrapper}>
        <Button
          className={classNames({ [s.buy_btn]: true, [s.btn]: true })}
          isShadow
          size="medium"
          label={t('Proceed', { ns: 'other' })}
          type="button"
          onClick={() => {
            dispatch(dedicOperations.rebootServer(elid, closeFn))
          }}
        />

        <button
          onClick={() => {
            closeFn()
          }}
          className={s.cancel_btn}
        >
          {t('Cancel', { ns: 'other' })}
        </button>
      </div>
    </div>
  )
}
