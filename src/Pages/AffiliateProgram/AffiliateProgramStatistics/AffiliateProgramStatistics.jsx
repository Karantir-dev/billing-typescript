import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import cn from 'classnames'
import {
  IconButton,
  StatisticsFilterModal,
  Pagination,
  // Backdrop,
} from '../../../Components'
import { affiliateOperations, usersOperations } from '../../../Redux'
import { Check } from '../../../images'

import s from './AffiliateProgramStatistics.module.scss'

export default function AffiliateProgramStatistics() {
  const dispatch = useDispatch()

  const [availableRights, setAvailabelRights] = useState({})
  useEffect(() => {
    dispatch(
      usersOperations.getAvailableRights('affiliate.client.click', setAvailabelRights),
    )
  }, [])
  const checkIfHasArr = availableRights?.toolbar?.toolgrp
  const isFilterAllowedToRender = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'filter')
    : false

  const { t } = useTranslation(['affiliate_program', 'other'])
  const widerThanMobile = useMediaQuery({ query: '(min-width: 768px)' })

  const [isFilterOpened, setIsFilterOpened] = useState(false)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  const [initialFilters, setInitialFilters] = useState({
    date: '',
    datesList: [],
    site: '',
    registered: '',
    payed: '',
  })

  // console.log(isFilterOpened, initialFilters)

  useEffect(() => {
    dispatch(
      affiliateOperations.getInitialStatistics(
        setItems,
        setTotal,
        setPageNumber,
        setInitialFilters,
      ),
    )
  }, [])

  const onPageChange = pageNum => {
    setPageNumber(pageNum)
    dispatch(affiliateOperations.getNextPageStatistics(setItems, setTotal, pageNum))
  }

  return (
    <div className={s.content}>
      {isFilterAllowedToRender && (
        <div className={s.filter_wrapper}>
          <IconButton
            className={s.icon_filter}
            onClick={() => setIsFilterOpened(true)}
            icon="filter"
          />

          <StatisticsFilterModal
            initialFilters={initialFilters}
            opened={isFilterOpened}
            closeFn={() => setIsFilterOpened(false)}
            setItems={setItems}
            setTotal={setTotal}
            setPageNumber={setPageNumber}
          />
        </div>
      )}
      {widerThanMobile && items.length > 0 && (
        <div className={s.table_head_row}>
          <span className={s.table_head}>{t('date', { ns: 'other' })}:</span>
          <span className={s.table_head}>{t('statistics_section.from_site')}:</span>
          <span className={s.table_head}>{t('statistics_section.client')}:</span>
          <span className={cn(s.table_head, s.centered)}>
            {t('statistics_section.payment')}:
          </span>
        </div>
      )}
      {items.length === 0 && (
        <p className={s.no_results}>{t('statistics_section.no_result')}</p>
      )}
      <ul className={s.list}>
        {items.map(({ cdate, payed, site, referal }, index) => {
          return widerThanMobile ? (
            <li className={s.list_item} key={index}>
              <span className={s.row_value}>
                {dayjs(cdate.$).format('DD MMM YYYY')} {t('short_year', { ns: 'other' })}
                <span className={s.time}>{dayjs(cdate.$).format('hh:mm')}</span>
              </span>

              <span className={cn(s.row_value, s.website)}>
                {site?.$ ? (
                  <span className={s.website_url}>{site?.$}</span>
                ) : (
                  <span className={s.stub}>{t('statistics_section.unknown_source')}</span>
                )}
                {site?.$ && <div className={s.full_text}>{site?.$}</div>}
              </span>

              <span className={s.row_value}>
                {referal?.$ || (
                  <span className={s.stub}>{t('statistics_section.not_registered')}</span>
                )}
              </span>

              <span className={s.row_value}>
                {payed?.$ === 'on' ? (
                  <Check className={s.icon_check} />
                ) : (
                  <span className={cn(s.stub, s.centered)}>
                    {t('statistics_section.not_paid')}
                  </span>
                )}
              </span>
            </li>
          ) : (
            <li className={s.list_item} key={nanoid()}>
              <span className={s.label}>{t('date', { ns: 'other' })}:</span>
              <span>
                {dayjs(cdate.$).format('DD MMM YYYY')} {t('short_year', { ns: 'other' })}
              </span>

              <span className={s.label}>{t('statistics_section.from_site')}:</span>
              <span className={s.website}>
                {site?.$ ? (
                  <span className={s.website_url}>{site?.$}</span>
                ) : (
                  <span className={s.stub}>{t('statistics_section.unknown_source')}</span>
                )}
                {site?.$ && <div className={s.full_text}>{site?.$}</div>}
              </span>

              <span className={s.label}>{t('statistics_section.client')}:</span>
              <span>
                {referal?.$ || (
                  <span className={s.stub}>{t('statistics_section.not_registered')}</span>
                )}
              </span>

              <span className={s.label}>{t('statistics_section.payment')}:</span>
              <span>
                {payed?.$ === 'on' ? (
                  <Check className={s.icon_check} />
                ) : (
                  <span className={s.stub}>{t('statistics_section.not_paid')}</span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
      <div className={s.footer_wrapper}>
        <Pagination
          currentPage={Number(pageNumber)}
          totalCount={Number(total)}
          pageSize={20}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
