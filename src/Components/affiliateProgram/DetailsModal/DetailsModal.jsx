import cn from 'classnames'
import { nanoid } from 'nanoid'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

import { Cross } from '../../../images'

import s from './DetailsModal.module.scss'

export default function DetailsModal({ details, closeModal }) {
  const { t } = useTranslation(['affiliate_program', 'other'])
  const widerThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  let daySum = 0

  const onBackdropClick = e => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  const sortedItems = details.sort((a, b) => {
    return b.reward.$.replace('%', '') - a.reward.$.replace('%', '')
  })

  return (
    <div
      tabIndex={0}
      onKeyUp={() => {}}
      role="button"
      className={cn(s.backdrop, { [s.opened]: details.length > 0 })}
      onClick={onBackdropClick}
    >
      <div className={cn(s.modal_window, { [s.opened]: details.length > 0 })}>
        <div className={s.heading_wrapper}>
          <p className={s.heading}>
            {t('income_section.detailed_statistics')}{' '}
            <span className={s.date}>{details[0]?.cdate?.$}</span>
          </p>
          <button type="button" onClick={closeModal}>
            <Cross className={s.icon_cross} />
          </button>
        </div>

        <div className={s.blur}>
          {widerThanMobile && (
            <div className={s.table_head_row}>
              <span className={s.table_head}>{t('income_section.service')}:</span>
              <span className={s.table_head}>{t('income_section.rate')}:</span>
              <span className={s.table_head}>{t('income_section.income')}:</span>
              <span className={s.table_head}>{t('income_section.referral')}:</span>
            </div>
          )}
          <ul className={s.list}>
            {sortedItems.map(({ amount, name, referal, reward }, index) => {
              daySum += Number(amount.$.replace(' EUR', ''))

              return widerThanMobile ? (
                <li className={s.list_item} key={index}>
                  <span className={s.row_value}>
                    {t(`services.${name.$.trim()}`, { ns: 'other' })}
                  </span>

                  <span className={s.row_value}>{reward.$}</span>

                  <span className={s.row_value}>{amount.$}</span>

                  <span className={s.row_value}>{referal.$}</span>
                </li>
              ) : (
                <li className={s.list_item} key={nanoid()}>
                  <span className={s.label}>{t('income_section.service')}:</span>
                  <span>{t(`services.${name.$.trim()}`, { ns: 'other' })}</span>

                  <span className={s.label}>{t('income_section.rate')}:</span>
                  <span>{reward.$}</span>

                  <span className={s.label}>{t('income_section.income')}:</span>
                  <span>{amount.$}</span>

                  <span className={s.label}>{t('income_section.referral')}:</span>
                  <span>{referal.$}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <p className={s.total}>
          <span className={s.total_label}>{t('income_section.total')}:</span>{' '}
          {daySum.toFixed(2)} EUR
        </p>
      </div>
    </div>
  )
}
