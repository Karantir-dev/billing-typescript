import React, { useState } from 'react'
import accessLogsOperations from '../../../Redux/accessLogs/accessLogsOperations'
import accessLogsSelectors from '../../../Redux/accessLogs/accessLogsSelectors'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { InputFieldNew, Select, IconButton, CalendarModal, Button } from '../..'
import s from '../AccessLogsComponents.module.scss'

export default function Component({ setCurrentPage }) {
  const { t } = useTranslation(['access_log', 'other'])
  const dispatch = useDispatch()

  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  const logsFilterList = useSelector(accessLogsSelectors.getLogsFilters)
  const logsCurrentFilter = useSelector(accessLogsSelectors.getCurrentLogsFilters)

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
    return { time, ip, timestart, timeend }
  }

  return (
    <div className={s.filterBlock}>
      <Formik
        enableReinitialize
        initialValues={{
          ip: parseCurrentFilter()?.ip || '',
          time: parseCurrentFilter()?.time || 'nodate',
          timestart: '',
          timeend: '',
        }}
        onSubmit={filterHandler}
      >
        {({ errors, touched, setFieldValue, values, setValues }) => {
          return (
            <Form className={s.form}>
              <InputFieldNew
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
                  {isOpenedCalendar && (
                    <div className={s.calendarModal}>
                      <CalendarModal
                        setStartDate={item => {
                          setFieldValue('timestart', item)
                          setFieldValue('time', 'other')
                        }}
                        setEndDate={item => setFieldValue('timeend', item)}
                        range={values?.timestart?.length !== 0}
                      />
                    </div>
                  )}
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
