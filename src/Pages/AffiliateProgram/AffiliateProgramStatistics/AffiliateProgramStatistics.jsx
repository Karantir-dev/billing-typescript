import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { IconButton, StatisticsFilterModal } from '../../../Components'
import { affiliateOperations } from '../../../Redux'
import { Check } from '../../../images'

import s from './AffiliateProgramStatistics.module.scss'

export default function AffiliateProgramStatistics() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['affiliate_program', 'other'])
  const widerThanMobile = useMediaQuery({ query: '(min-width: 768px)' })

  const [isFilterOpened, setIsFilterOpened] = useState(false)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageCount, setpageCount] = useState(0)

  useEffect(() => {
    dispatch(
      affiliateOperations.getInitialStatistics(
        setItems,
        setTotal,
        setPageNumber,
        setpageCount,
      ),
    )
  }, [])

  return (
    <div className={s.content}>
      <IconButton
        className={s.icon_filter}
        onClick={() => setIsFilterOpened(true)}
        icon="filter"
      />

      <StatisticsFilterModal
        opened={isFilterOpened}
        closeFn={() => setIsFilterOpened(false)}
      />

      <ul className={s.list}>
        {items.map(({ cdate, payed, site, referal }, index) => {
          return widerThanMobile ? (
            <li className={s.list_item} key={index}>
              <span className={s.row_value}>{cdate.$}</span>

              <span className={s.row_value}>{site?.$}</span>

              <span className={s.row_value}>{referal?.$}</span>

              <span className={s.row_value}>
                {payed?.$ === 'on' && <Check className={s.icon_check} />}
              </span>
            </li>
          ) : (
            <li className={s.list_item} key={nanoid()}>
              <span className={s.label}>{t('date', { ns: 'other' })}:</span>
              <span className={s.value}>
                {dayjs(cdate.$).format('DD MMM YYYY')} {t('short_year', { ns: 'other' })}
              </span>

              <span className={s.label}>{t('statistics_section.from_site')}:</span>
              <span className={s.value}>{site?.$}</span>

              <span className={s.label}>{t('statistics_section.client')}:</span>
              <span className={s.value}>
                {referal?.$ || (
                  <span className={s.stub}>{t('statistics_section.not_registered')}</span>
                )}
              </span>

              <span className={s.label}>{t('statistics_section.payment')}:</span>
              <span className={s.value}>
                {payed?.$ !== 'off' && <Check className={s.icon_check} />}
              </span>
            </li>
          )
        })}
      </ul>
      <span>{total}</span>
      <ul>
        pagination pageNumber {pageNumber} pageCount {pageCount}
      </ul>
    </div>
  )
}
