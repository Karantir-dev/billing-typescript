import React, { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { useDispatch } from 'react-redux'

import { affiliateOperations } from '../../../Redux'
import {
  Button,
  CalendarModal,
  IconButton,
  Select,
  IncomeTable,
} from '../../../Components'
import { useOutsideAlerter } from '../../../utils'

import animations from './animations.module.scss'
import s from './AffiliateProgramIncome.module.scss'

export default function AffiliateProgramIncome() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['affiliate_program', 'other'])
  const descrWrapper = useRef(null)
  const dropdownCalendar = useRef(null)
  const higherThanMobile = useMediaQuery({ query: '(min-width: 768px)' })

  const [isDescrOpened, setIsDescrOpened] = useState(false)
  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  const [selectedPeriod, setSelectedPeriod] = useState('')

  const [periods, setPeriods] = useState([])
  const [tableData, setTableData] = useState([])

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, () => {
    if (dropdownCalendar?.current.className.includes(animations.enterActive)) {
      return
    }

    setIsOpenedCalendar(false)
  })

  useEffect(() => {
    dispatch(affiliateOperations.getInitialIncomeInfo(setPeriods, setTableData))
  }, [])

  const toggleDescrHeight = () => {
    if (!isDescrOpened) {
      descrWrapper.current.style.height = descrWrapper.current.scrollHeight + 25 + 'px'
    } else {
      descrWrapper.current.removeAttribute('style')
    }
    setIsDescrOpened(!isDescrOpened)
  }

  const handleSearch = () => {
    dispatch(affiliateOperations.getChartInfo(setTableData, selectedPeriod))
  }

  return (
    <>
      <div className={s.description_wrapper} ref={descrWrapper}>
        <p className={s.paragraph}>{t('income_section.description')}</p>
      </div>
      {!higherThanMobile && (
        <button
          className={s.btn_more}
          type="button"
          onClick={toggleDescrHeight}
          data-testid="btn_more"
        >
          {t('read_more', { ns: 'other' })}
        </button>
      )}
      <div className={s.filter_wrapper}>
        <Select
          inputClassName={s.select}
          isShadow
          itemsList={periods.map(({ label, value }) => ({
            label: t(`${label.trim()}`, { ns: 'other' }),
            value,
          }))}
          value={typeof selectedPeriod === 'object' ? 'other' : ''}
          getElement={setSelectedPeriod}
          placeholder={t('income_section.select_placeholder')}
        />

        <div className={s.calendarBlock}>
          <IconButton
            onClick={() => {
              console.log('icon click')
              setIsOpenedCalendar(true)
            }}
            icon="calendar"
          />
          <CSSTransition
            in={isOpenedCalendar}
            classNames={animations}
            timeout={150}
            unmountOnExit
          >
            <div className={s.calendarModal} ref={dropdownCalendar}>
              <CalendarModal pointerClassName={s.calendar_pointer} />
            </div>
          </CSSTransition>
        </div>
      </div>

      <Button
        className={s.btn_search}
        label={t('search', { ns: 'other' })}
        onClick={handleSearch}
      />
      {tableData.length > 0 && (
        <>
          <p className={s.table_title}>{t('income_section.table')}</p>
          <IncomeTable list={tableData} />
        </>
      )}
    </>
  )
}
