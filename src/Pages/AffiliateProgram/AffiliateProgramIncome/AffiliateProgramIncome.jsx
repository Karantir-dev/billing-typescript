import React, { useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
// import { CSSTransition } from 'react-transition-group'

import { Button, CalendarModal, IconButton, Select } from '../../../Components'
import { useOutsideAlerter } from '../../../utils'

// import animations from './animations.module.scss'
import s from './AffiliateProgramIncome.module.scss'

export default function Page() {
  const { t } = useTranslation('affiliate_program')
  const descrWrapper = useRef(null)
  const dropdownCalendar = useRef(null)
  const higherThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  console.log(dropdownCalendar.current)
  const [isDescrOpened, setIsDescrOpened] = useState(false)
  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, () => {
    console.log('outside click')
    setIsOpenedCalendar(false)
  })

  const toggleDescrHeight = () => {
    if (!isDescrOpened) {
      descrWrapper.current.style.height = descrWrapper.current.scrollHeight + 25 + 'px'
    } else {
      descrWrapper.current.removeAttribute('style')
    }
    setIsDescrOpened(!isDescrOpened)
  }
  const periods = [
    { label: t('income_section.periods.current_year'), value: 'currentyear' },
    { label: t('income_section.periods.current_month'), value: 'currentmonth' },
    { label: t('income_section.periods.current_week'), value: 'currentweek' },
    { label: t('income_section.periods.current_day'), value: 'today' },
    { label: t('income_section.periods.previous_year'), value: 'lastyear' },
    { label: t('income_section.periods.previous_month'), value: 'lastmonth' },
    { label: t('income_section.periods.previous_week'), value: 'lastweek' },
    { label: t('income_section.periods.previous_day'), value: 'lastday' },
    { label: t('income_section.periods.year'), value: 'year' },
    { label: t('income_section.periods.half_a_year'), value: 'halfyear' },
    { label: t('income_section.periods.quarter'), value: 'quarter' },
    { label: t('income_section.periods.month'), value: 'month' },
    { label: t('income_section.periods.week'), value: 'week' },
    { label: t('income_section.periods.whole_period'), value: 'nodate' },
    { label: t('income_section.periods.any_period'), value: 'other' },
  ]
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
          itemsList={periods}
          value={'currentyear'}
        />

        <div className={s.calendarBlock}>
          <IconButton
            onClick={() => {
              console.log('icon click')
              setIsOpenedCalendar(true)
            }}
            icon="calendar"
          />
          {/* <CSSTransition
            in={isOpenedCalendar}
            nodeRef={dropdownCalendar}
            classNames={animations}
            timeout={2000}
            unmountOnExit
          > */}
          {isOpenedCalendar && (
            <div className={s.calendarModal} ref={dropdownCalendar}>
              <CalendarModal pointerClassName={s.calendar_pointer} />
            </div>
          )}
          {/* </CSSTransition> */}
        </div>
      </div>

      <Button className={s.btn_search} label={t('search', { ns: 'other' })} />
    </>
  )
}
