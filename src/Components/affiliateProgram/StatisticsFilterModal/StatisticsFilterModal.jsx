import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../images'

import s from './StatisticsFilterModal.module.scss'

export default function StatisticsFilterModal({ opened, closeFn }) {
  const { t } = useTranslation(['affiliate_program', 'other'])

  const onBackdropClick = e => {
    if (e.target === e.currentTarget) {
      closeFn()
    }
  }
  return (
    <div
      tabIndex={0}
      onKeyUp={() => {}}
      role="button"
      className={cn(s.backdrop, { [s.opened]: opened })}
      onClick={onBackdropClick}
    >
      <div className={cn(s.modal_window, { [s.opened]: opened })}>
        <div className={s.heading_wrapper}>
          <p className={s.heading}>{t('')}</p>
          <button type="button" onClick={closeFn}>
            <Cross className={s.icon_cross} />
          </button>
        </div>
      </div>
    </div>
  )
}
