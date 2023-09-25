import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { useDispatch } from 'react-redux'

import { affiliateOperations } from '@redux'
import {
  Button,
  CalendarModal,
  IconButton,
  Select,
  IncomeTable,
  IncomeChart,
  Loader,
} from '@components'
import { useCancelRequest, useOutsideAlerter } from '@utils'
import animations from './animations.module.scss'
import s from './AffiliateProgramIncome.module.scss'

export default function AffiliateProgramIncome() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['affiliate_program', 'other'])
  const descrWrapper = useRef(null)
  const dropdownCalendar = useRef(null)
  const higherThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [isDescrOpened, setIsDescrOpened] = useState(false)
  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  const [fixedPeriod, setFixedPeriod] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')

  const [formOptions, setFormOptions] = useState([])
  const [incomeData, setIncomeData] = useState([])

  const [error, setError] = useState(false)

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, () => {
    if (dropdownCalendar?.current.className.includes(animations.enterActive)) {
      return
    }

    setIsOpenedCalendar(false)
  })

  useEffect(() => {
    dispatch(
      affiliateOperations.getInitialIncomeInfo(
        setFormOptions,
        setIncomeData,
        setFixedPeriod,
        signal,
        setIsLoading,
      ),
    )
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
    if ((fixedPeriod && fixedPeriod !== 'other') || (periodStart && periodEnd)) {
      dispatch(
        affiliateOperations.getChartInfo(
          setIncomeData,
          fixedPeriod,
          periodStart,
          periodEnd,
          signal,
          setIsLoading,
        ),
      )
    } else {
      setError(true)
    }
  }

  const calendarValue = periodEnd
    ? [new Date(periodStart), new Date(periodEnd)]
    : periodStart
    ? new Date(periodStart)
    : null

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
          {t(isDescrOpened ? 'collapse' : 'read_more', { ns: 'other' })}
        </button>
      )}

      <div className={s.max_content_width}>
        <div className={s.tablet_wrapper}>
          <div className={s.filter_wrapper}>
            <Select
              className={s.select_wrapper}
              inputClassName={s.select}
              isShadow
              itemsList={formOptions.map(({ label, value }) => ({
                label: t(`${label.trim()}`, { ns: 'other' }),
                value,
              }))}
              value={fixedPeriod}
              getElement={value => {
                setError(false)
                setFixedPeriod(value)
                setPeriodStart('')
                setPeriodEnd('')
              }}
              placeholder={t('income_section.select_placeholder')}
            />

            <div className={s.calendarBlock}>
              <IconButton
                className={s.icon_btn}
                onClick={() => setIsOpenedCalendar(true)}
                icon="calendar"
              />
              <CSSTransition
                in={isOpenedCalendar}
                classNames={animations}
                timeout={150}
                unmountOnExit
              >
                <div className={s.calendarModal} ref={dropdownCalendar}>
                  <CalendarModal
                    pointerClassName={s.calendar_pointer}
                    setStartDate={date => {
                      setError(false)
                      setPeriodStart(date)
                      setPeriodEnd('')
                      setFixedPeriod('other')
                    }}
                    setEndDate={date => {
                      setError(false)
                      setPeriodEnd(date)
                    }}
                    range={Boolean(periodStart)}
                    value={calendarValue}
                  />
                </div>
              </CSSTransition>
            </div>
            {error && (
              <span className={s.error_msg}>
                {t('income_section.select_placeholder')}
              </span>
            )}
          </div>

          <Button
            className={s.btn_search}
            label={t('search', { ns: 'other' })}
            isShadow
            onClick={handleSearch}
          />
        </div>

        <p className={s.table_title}>{t('income_section.chart')}</p>
        <div className={s.chart_wrapper}>
          {incomeData.length < 2 && (
            <p className={s.chart_placeholder}>{t('income_section.chart_placeholder')}</p>
          )}
          <IncomeChart incomeData={incomeData} />
        </div>

        {incomeData.length > 0 && (
          <>
            <p className={s.table_title}>{t('income_section.table')}</p>
            <IncomeTable list={incomeData} />
          </>
        )}
      </div>
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
