import React from 'react'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'

import s from './IncomeTable.module.scss'

export default function IncomeTable({ list }) {
  const { t } = useTranslation(['affiliate_program', 'other'])
  let incomeSum = 0
  return (
    <>
      <div className={s.table_head_row}>
        <span className={s.table_head}>{t('date', { ns: 'other' })}:</span>
        <span className={s.table_head}>{t('income_section.income_amount')}:</span>
      </div>
      <ul>
        {list.map(({ amount, date }) => {
          incomeSum += Number(amount.replace(' EUR', ''))
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
      <p className={s.table_footer}>
        <span className={s.income_sum}></span>
        <span className={s.income_sum}>{incomeSum.toFixed(2) + ' EUR'}</span>
      </p>
    </>
  )
}
