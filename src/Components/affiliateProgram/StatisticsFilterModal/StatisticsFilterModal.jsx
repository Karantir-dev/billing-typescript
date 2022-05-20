import cn from 'classnames'
import { Form, Formik } from 'formik'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Cross } from '../../../images'
import { Button, Select, CalendarModal, IconButton, InputField } from '../..'
import { affiliateOperations } from '../../../Redux'
import { useOutsideAlerter } from '../../../utils'

import animations from './animations.module.scss'
import s from './StatisticsFilterModal.module.scss'

export default function StatisticsFilterModal({
  opened,
  closeFn,
  setItems,
  setTotal,
  setPageNumber,
  initialFilters,
}) {
  const dispatch = useDispatch()
  const { t } = useTranslation(['affiliate_program', 'other'])
  const widerThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  const dropdownCalendar = useRef(null)

  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, () => {
    if (dropdownCalendar?.current.className.includes(animations.enterActive)) {
      return
    }

    setIsOpenedCalendar(false)
  })

  const onBackdropClick = e => {
    if (e.target === e.currentTarget) {
      closeFn()
    }
  }

  const onSubmit = values => {
    dispatch(affiliateOperations.getFilteredStatistics(values, setItems, setTotal))
    closeFn()
  }

  const onClearFilter = () => {
    dispatch(affiliateOperations.dropFilters(setItems, setTotal))
    setPageNumber(1)
    closeFn()
  }

  const optionsList = [
    { label: t('Yes', { ns: 'other' }), value: 'on' },
    { label: t('-- none --', { ns: 'other' }), value: 'null' },
  ]

  return (
    <>
      <div
        tabIndex={0}
        onKeyUp={() => {}}
        role="button"
        className={cn(s.backdrop, { [s.opened]: opened })}
        onClick={onBackdropClick}
      ></div>

      <div className={cn(s.modal_window, { [s.opened]: opened })}>
        <div className={s.pointer_wrapper}>
          <div className={s.pointer}></div>
        </div>
        <div className={s.heading_wrapper}>
          {!widerThanMobile && (
            <p className={s.heading}>{t('statistics_section.filter')}</p>
          )}
          <button type="button" onClick={closeFn}>
            <Cross className={s.icon_cross} />
          </button>
        </div>

        <Formik
          initialValues={{
            date: initialFilters.date || 'nodate',
            dateStart: '',
            dateEnd: '',
            site: initialFilters.site || '',
            registered: initialFilters.registered || 'null',
            payed: initialFilters.payed || 'null',
          }}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, resetForm }) => {
            const calendarValue = values.dateEnd
              ? [new Date(values.dateStart), new Date(values.dateEnd)]
              : values.dateStart
              ? new Date(values.dateStart)
              : null

            return (
              <>
                <Form className={s.form}>
                  <div className={s.dates_wrapper}>
                    <Select
                      inputClassName={s.select_bgc}
                      name="date"
                      label={`${t('statistics_section.transition_date')}:`}
                      value={values.date}
                      getElement={value => setFieldValue('date', value)}
                      isShadow
                    />

                    <div className={s.calendarBlock}>
                      <IconButton
                        className={s.icon_calendar}
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
                              setFieldValue('dateStart', date)
                              setFieldValue('dateEnd', '')
                              setFieldValue('date', 'other')
                            }}
                            setEndDate={date => {
                              setFieldValue('dateEnd', date)
                            }}
                            range={Boolean(values.dateStart)}
                            value={calendarValue}
                          />
                        </div>
                      </CSSTransition>
                    </div>
                  </div>

                  <InputField
                    name="site"
                    className={s.form_field}
                    inputClassName={s.input_bgc}
                    label={`${t('statistics_section.from_site')}:`}
                    placeholder={t('statistics_section.website_url')}
                    touched={false}
                    error={false}
                    autoComplete
                    isShadow
                    height={44}
                  />

                  <Select
                    name="registered"
                    inputClassName={s.select_bgc}
                    className={s.form_field}
                    label={`${t('statistics_section.client_registered')}:`}
                    value={values.registered}
                    itemsList={optionsList}
                    getElement={value => setFieldValue('registered', value)}
                    isShadow
                  />

                  <Select
                    name="payed"
                    inputClassName={s.select_bgc}
                    className={s.form_field}
                    label={`${t('statistics_section.client_payed')}:`}
                    value={values.payed}
                    itemsList={optionsList}
                    getElement={value => setFieldValue('payed', value)}
                    isShadow
                  />

                  <Button
                    className={s.submit_btn}
                    label={t('statistics_section.apply')}
                    type="submit"
                    isShadow
                  />

                  <button
                    className={s.clear_btn}
                    onClick={() => {
                      resetForm()
                      onClearFilter()
                    }}
                    type="button"
                  >
                    {t('Clear filter', { ns: 'other' })}
                  </button>
                </Form>
              </>
            )
          }}
        </Formik>
      </div>
    </>
  )
}
