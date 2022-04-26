import React from 'react'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'

import s from './IncomeTable.module.scss'

export default function IncomeTable({ list }) {
  const { t } = useTranslation(['affiliate_program', 'other'])

  return (
    <>
      <div className={s.table_head_row}>
        <span className={s.table_head}>{t('date', { ns: 'other' })}:</span>
        <span className={s.table_head}>{t('income_section.income_amount')}:</span>
      </div>
      <ul>
        {list.map(({ amount, date }) => {
          return (
            <li className={s.table_row} key={nanoid()}>
              <button className={s.table_btn} type="button">
                <span className={s.table_date}>{date}</span>
                <span className={s.table_amount}>{amount}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
