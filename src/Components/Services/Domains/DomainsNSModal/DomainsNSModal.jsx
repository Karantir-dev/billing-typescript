import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Portal } from '../../..'
import s from './DomainsNSModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { name, closeNSModalHandler, NSData } = props

  console.log(NSData)
  return (
    <Portal>
      <div className={s.modalBg}>
        <div className={s.modalBlock}>
          <div className={s.modalHeader}>
            <span className={s.headerText}>
              {t('Name servers')} - {name}
            </span>
            <Cross onClick={closeNSModalHandler} className={s.crossIcon} />
          </div>
        </div>
      </div>
    </Portal>
  )
}
