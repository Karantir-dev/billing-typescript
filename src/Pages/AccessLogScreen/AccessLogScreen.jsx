import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectors } from '../../Redux/selectors'
import { BASE_URL } from '../../config/config'
import accessLogsSelectors from '../../Redux/accessLogs/accessLogsSelectors'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import {
  AsideServicesMenu,
  IconButton,
  Button,
  InputFieldNew,
  Select,
  AccessLogsTable,
  CalendarModal,
} from '../../Components/'
import s from './AccessLogScreen.module.scss'
import accessLogsOperations from '../../Redux/accessLogs/accessLogsOperations'

export default function MainPage() {
  const { t } = useTranslation(['access_log', 'other'])
  const dispatch = useDispatch()

  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const logsList = useSelector(accessLogsSelectors.getLogsList)
  const logsFilterList = useSelector(accessLogsSelectors.getLogsFilters)
  const logsCurrentFilter = useSelector(accessLogsSelectors.getCurrentLogsFilters)

  useEffect(() => {
    dispatch(accessLogsOperations.getAccessLogsHandler())
    dispatch(accessLogsOperations.getAccessLogsFiltersHandler())
  }, [])

  const filterHandler = values => {
    setIsOpenedCalendar(false)
    dispatch(accessLogsOperations.filterDataHandler(values))
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
    <div className={cn({ [s.wrapper]: true, [s.dt]: darkTheme })}>
      <AsideServicesMenu />
      <div className={s.body}>
        <div className={s.content}>
          <h1 className={s.pageTitle}>{t('access_log')}</h1>
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
              {({ errors, touched, setFieldValue, values }) => {
                return (
                  <Form className={s.form}>
                    <InputFieldNew
                      name="ip"
                      placeholder={t('remote_ip_address')}
                      isShadow
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
                    <Button
                      className={s.searchBtn}
                      isShadow
                      size="medium"
                      label={t('search', { ns: 'other' })}
                      type="submit"
                    />
                  </Form>
                )
              }}
            </Formik>
            <IconButton
              onClick={() =>
                window.open(
                  `${BASE_URL}/?clickstat=yes&sfrom=ajax&func=authlog&out=csv`,
                  '_blank',
                )
              }
              className={s.csvBtn}
              icon="csv"
            />
          </div>
          <AccessLogsTable list={logsList} />
        </div>
      </div>
    </div>
  )
}
