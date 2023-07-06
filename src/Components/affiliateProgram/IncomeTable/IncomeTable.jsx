import { useState } from 'react'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { DetailsModal } from '@components'
import { affiliateOperations } from '@redux'

import s from './IncomeTable.module.scss'
import dayjs from 'dayjs'

export default function IncomeTable({ list }) {
  const { t } = useTranslation(['affiliate_program', 'other'])
  const dispatch = useDispatch()
  let incomeSum = 0
  const sortedList = [...list].sort((a, b) => dayjs(b.date) - dayjs(a.date))

  const [details, setDetails] = useState([])

  const onDayClick = date => {
    dispatch(affiliateOperations.getDayDetails(date, setDetails))
  }

  return (
    <>
      <div className={s.table_head_row}>
        <span className={s.table_head}>{t('date', { ns: 'other' })}:</span>
        <span className={s.table_head}>{t('income_section.income_amount')}:</span>
      </div>
      <ul>
        {sortedList.map(({ amount, date }) => {
          incomeSum += Number(amount.replace(' EUR', ''))
          return (
            <li className={s.table_row} key={nanoid()}>
              <button
                className={s.table_btn}
                type="button"
                onClick={() => onDayClick(date)}
              >
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

      <DetailsModal details={details} closeModal={() => setDetails([])} />
    </>
  )
}
