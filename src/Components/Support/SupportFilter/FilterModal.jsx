import React, { useState, useRef } from 'react'
// import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
// import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { useOutsideAlerter } from '../../../utils'
import { Formik, Form } from 'formik'
import { InputField, Select, IconButton, CalendarModal, Button } from '../..'
import s from './SupportFilter.module.scss'

export default function Component(props) {
  const { setFilterModal } = props
  const { t } = useTranslation(['support', 'other'])
  //   const dispatch = useDispatch()

  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)
  const dropdownCalendar = useRef(null)

  const clickOutside = () => {
    setIsOpenedCalendar(false)
  }

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, clickOutside)

  const resetFilterHandler = setValues => {
    const clearField = {
      id: '',
      message: '',
      name: '',
      abuse: '',
      tstatus: '',
      time: 'nodate',
      message_poststart: '',
      message_postend: '',
    }
    // setCurrentPage(1)
    setValues({ ...clearField })
    setFilterModal(false)
    // dispatch(accessLogsOperations.filterDataHandler(clearField))
  }

  return (
    <div className={s.filterModal}>
      <Formik
        enableReinitialize
        initialValues={{
          id: '',
          message: '',
          name: '',
          abuse: '',
          tstatus: '',
          time: 'nodate',
          message_poststart: '',
          message_postend: '',
        }}
        onSubmit={values => console.log(values)}
      >
        {({ errors, touched, setFieldValue, values, setValues }) => {
          //   let dates = null
          //   if (values.timestart && values.timeend) {
          //     dates = [new Date(values.timestart), new Date(values.timeend)]
          //   } else if (values.timestart) {
          //     dates = new Date(values.timestart)
          //   }
          return (
            <Form className={s.form}>
              <div className={s.inputRow}>
                <InputField
                  name="id"
                  label={t('request_id')}
                  placeholder={t('Enter id', { ns: 'other' })}
                  isShadow
                  className={s.searchInput}
                  error={!!errors.email}
                  touched={!!touched.email}
                />
                <InputField
                  name="message"
                  label={t('Contains text')}
                  placeholder={t('Enter text', { ns: 'other' })}
                  isShadow
                  className={s.searchInput}
                  error={!!errors.email}
                  touched={!!touched.email}
                />
                <InputField
                  name="name"
                  label={t('theme', { ns: 'other' })}
                  placeholder={t('Enter request subject')}
                  isShadow
                  className={s.searchInput}
                  error={!!errors.email}
                  touched={!!touched.email}
                />
              </div>
              <div className={s.selectAndBtn}>
                <Select
                  placeholder={t('Not chosen', { ns: 'other' })}
                  label={t('The request is related to a violation')}
                  value={values.abuse}
                  getElement={item => setFieldValue('abuse', item)}
                  isShadow
                  itemsList={[]}
                  className={s.select}
                />
                <Select
                  placeholder={t('Select status', { ns: 'other' })}
                  label={t('status', { ns: 'other' })}
                  value={values.tstatus}
                  getElement={item => setFieldValue('tstatus', item)}
                  isShadow
                  itemsList={[]}
                  className={s.select}
                />
                <Select
                  label={t('Period', { ns: 'other' })}
                  value={values.time}
                  getElement={item => setFieldValue('time', item)}
                  isShadow
                  itemsList={[]}
                  className={cn(s.select, s.dateSelect)}
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
                      value={''}
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
                  {t('Clear filter', { ns: 'other' })}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

Component.propTypes = {}

Component.defaultProps = {}
