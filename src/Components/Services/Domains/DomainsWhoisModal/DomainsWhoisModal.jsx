import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Portal } from '../../..'
import s from './DomainsWhoisModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { name, closeWhoisModalHandler, whoisData } = props

  return (
    <Portal>
      <div className={s.modalBg}>
        <div className={s.modalBlock}>
          <div className={s.modalHeader}>
            <span className={s.headerText}>
              {t('Domain Information')} - {name}
            </span>
            <Cross onClick={closeWhoisModalHandler} className={s.crossIcon} />
          </div>
          <div className={s.whoisBlock}>{whoisData}</div>
        </div>
      </div>
    </Portal>
  )
}
