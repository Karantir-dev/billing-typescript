import React, { useState, useRef } from 'react'
import accessLogsOperations from '../../../Redux/accessLogs/accessLogsOperations'
import accessLogsSelectors from '../../../Redux/accessLogs/accessLogsSelectors'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useOutsideAlerter } from '../../../utils'
import { Formik, Form } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { InputField, Select, IconButton, CalendarModal, Button } from '../..'
import s from '../AccessLogsComponents.module.scss'

export default function Component({ setCurrentPage }) {
  const { t } = useTranslation(['access_log', 'other'])
  const dispatch = useDispatch()

  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  const logsFilterList = useSelector(accessLogsSelectors.getLogsFilters)
  const logsCurrentFilter = useSelector(accessLogsSelectors.getCurrentLogsFilters)

  const dropdownCalendar = useRef(null)

  const clickOutside = () => {
    setTimeout(() => {
      setIsOpenedCalendar(false)
    }, 100)
  }

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, clickOutside)

  const filterHandler = values => {
    setCurrentPage(1)
    setIsOpenedCalendar(false)
    dispatch(accessLogsOperations.filterDataHandler(values))
  }

  const resetFilterHandler = setValues => {
    const clearField = {
      ip: '',
      time: 'nodate',
      timestart: '',
      timeend: '',
    }
    setCurrentPage(1)
    setValues({ ...clearField })
    dispatch(accessLogsOperations.filterDataHandler(clearField))
  }

  const parseCurrentFilter = () => {
    let time = null
    let ip = null
    let timestart = null
    let timeend = null
    if (Array.isArray(logsCurrentFilter)) {
      logsCurrentFilter?.forEach(({ $name, $ }) => {
        if ($name === 'time') {
          time = $
        }
        if ($name === 'ip') {
          ip = $
        }
        if ($name === 'timestart') {
          timestart = $
        }
        if ($name === 'timeend') {
          timeend = $
        }
      })
    } else if (logsCurrentFilter) {
      const { $name, $ } = logsCurrentFilter
      if ($name === 'time') {
        time = $
      }
      if ($name === 'ip') {
        ip = $
      }
      if ($name === 'timestart') {
        timestart = $
      }
      if ($name === 'timeend') {
        timeend = $
      }
    }
    let dates = null
    if (timestart && timeend) {
      dates = [new Date(timestart), new Date(timeend)]
    } else if (timestart) {
      dates = new Date(timestart)
    }
    return { time, ip, dates }
  }

  return (
    <div className={s.filterBlock}>
      <Formik
        enableReinitialize
        initialValues={{
          ip: parseCurrentFilter()?.ip || '',
          time: parseCurrentFilter()?.time || 'nodate',
          timestart: null,
          timeend: null,
        }}
        onSubmit={filterHandler}
      >
        {({ errors, touched, setFieldValue, values, setValues }) => {
          let dates = null
          if (values.timestart && values.timeend) {
            dates = [new Date(values.timestart), new Date(values.timeend)]
          } else if (values.timestart) {
            dates = new Date(values.timestart)
          }
          return (
            <Form className={s.form}>
              <InputField
                name="ip"
                placeholder={t('remote_ip_address')}
                isShadow
                height={46}
                iconRight="search"
                className={s.searchInput}
                error={!!errors.email}
                touched={!!touched.email}
              />
              <div className={s.selectAndBtn}>
                <Select
                  value={values.time}
                  getElement={item => setFieldValue('time', item)}
                  isShadow
                  itemsList={logsFilterList}
                  className={s.select}
                />
                <div className={s.calendarBlock}>
                  <IconButton
                    onClick={() => setIsOpenedCalendar(!isOpenedCalendar)}
                    icon="calendar"
                    className={s.calendarBtn}
                  />
                  <div
                    ref={dropdownCalendar}
                    className={cn(s.calendarModal, { [s.opened]: isOpenedCalendar })}
                  >
                    <CalendarModal
                      value={dates || parseCurrentFilter()?.dates}
                      setStartDate={item => {
                        setFieldValue('timestart', item)
                        setFieldValue('time', 'other')
                      }}
                      setEndDate={item => setFieldValue('timeend', item)}
                      range={values?.timestart?.length !== 0}
                    />
                  </div>
                </div>
              </div>
              <div className={s.btnBlock}>
                <Button
                  className={s.searchBtn}
                  isShadow
                  size="medium"
                  label={t('search', { ns: 'other' })}
                  type="submit"
                />
                <button
                  onClick={() => resetFilterHandler(setValues)}
                  type="button"
                  className={s.clearFilters}
                >
                  {t('clear_filter')}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
      <IconButton
        onClick={() => dispatch(accessLogsOperations.getAccessLogsCvs())}
        className={s.csvBtn}
        icon="csv"
      />
    </div>
  )
}

Component.propTypes = {
  setCurrentPage: PropTypes.func,
}

Component.defaultProps = {
  setCurrentPage: () => null,
}
