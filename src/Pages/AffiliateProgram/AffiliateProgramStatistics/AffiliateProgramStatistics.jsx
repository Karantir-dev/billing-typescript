import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import cn from 'classnames'
import { IconButton, StatisticsFilterModal, Pagination } from '../../../Components'
import { actions, affiliateOperations, usersOperations } from '../../../Redux'
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

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    if (isFilterOpened) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [isFilterOpened])

  const [initialFilters, setInitialFilters] = useState({
    date: '',
    datesList: [],
    site: '',
    registered: '',
    payed: '',
  })

  useEffect(() => {
    dispatch(
      affiliateOperations.getInitialStatistics(
        setItems,
        setTotal,
        setP_num,
        setInitialFilters,
        p_cnt,
      ),
    )
    onClearFilter()
  }, [p_cnt])

  const onPageChange = pageNum => {
    setP_num(pageNum)
    dispatch(
      affiliateOperations.getNextPageStatistics(setItems, setTotal, pageNum, p_cnt),
    )
  }

  const onSubmit = values => {
    dispatch(affiliateOperations.getFilteredStatistics(values, setItems, setTotal, p_cnt))
    setP_num(1)
    setIsFiltered && setIsFiltered(true)
    setIsFilterOpened(false)
  }

  const onClearFilter = () => {
    dispatch(affiliateOperations.dropFilters(setItems, setTotal, p_cnt))
    setP_num(1)
    setIsFilterOpened(false)
    setIsFiltered && setIsFiltered(false)
  }

  return (
    <div className={s.content}>
      {isFilterAllowedToRender && (
        <div className={s.filter_wrapper}>
          <IconButton
            onClick={() => setIsFilterOpened(true)}
            icon="filter"
            disabled={!(isFiltered || items?.length > 0)}
            className={cn(s.icon_filter, { [s.filtered]: isFiltered })}
          />

          <StatisticsFilterModal
            initialFilters={initialFilters}
            opened={isFilterOpened}
            closeFn={() => setIsFilterOpened(false)}
            onSubmit={onSubmit}
            onClearFilter={onClearFilter}
          />
        </div>
      )}
      {widerThanMobile && items.length > 0 && (
        <div className={s.table_head_row}>
          <span className={s.table_head}>{t('date', { ns: 'other' })}:</span>
          <span className={s.table_head}>{t('statistics_section.from_site')}:</span>
          <span className={s.table_head}>{t('statistics_section.client')}:</span>
          <span className={s.table_head}>{t('statistics_section.payment')}:</span>
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
                  <span className={s.stub}>{t('statistics_section.not_paid')}</span>
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

      {total > 5 && (
        <div className={s.footer_wrapper}>
          <Pagination
            totalCount={Number(total)}
            currentPage={Number(p_num)}
            pageSize={Number(p_cnt)}
            onPageChange={page => onPageChange(page)}
            onPageItemChange={items => setP_cnt(items)}
          />
        </div>
      )}
    </div>
  )
}
