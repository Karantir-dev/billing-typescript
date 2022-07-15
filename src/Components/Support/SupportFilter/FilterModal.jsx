import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import { useOutsideAlerter } from '../../../utils'
import { Formik, Form } from 'formik'
import {
  InputField,
  Select,
  IconButton,
  CalendarModal,
  Button,
  SelectMultiple,
} from '../..'
import { Cross } from '../../../images'
import { supportSelectors } from '../../../Redux'
import s from './SupportFilter.module.scss'

export default function Component(props) {
  const { setFilterModal, filterModal, filterHandler, resetFilterHandler } = props
  const { t } = useTranslation(['support', 'other'])

  const abuseFilterList = useSelector(supportSelectors.getAbuseFilterList)
  const statusFilterList = useSelector(supportSelectors.getTstatusFilterList)
  const timeFilterList = useSelector(supportSelectors.getTimeFilterList)
  const currentFilters = useSelector(supportSelectors.getCurrentFilters)

  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)
  const dropdownCalendar = useRef(null)
  const modal = useRef(null)

  const clickOutsideCalendar = () => {
    setIsOpenedCalendar(false)
  }

  const clickOutsideModal = () => {
    setFilterModal(false)
  }

  useOutsideAlerter(modal, filterModal, clickOutsideModal)

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, clickOutsideCalendar)

  return (
    <div ref={modal} className={s.filterModal}>
      <Formik
        enableReinitialize
        initialValues={{
          id: currentFilters?.id || '',
          message: currentFilters?.message || '',
          name: currentFilters?.name || '',
          abuse: currentFilters?.abuse || 'null',
          tstatus: currentFilters?.tstatus || '',
          message_post: currentFilters?.message_post || 'nodate',
          message_poststart: currentFilters?.message_poststart || '',
          message_postend: currentFilters?.message_postend || '',
        }}
        onSubmit={filterHandler}
      >
        {({ errors, touched, setFieldValue, values, setValues }) => {
          let dates = null
          if (values.message_poststart && values.message_postend) {
            dates = [new Date(values.message_poststart), new Date(values.message_postend)]
          } else if (values.message_poststart) {
            dates = new Date(values.message_poststart)
          }
          return (
            <Form className={s.form}>
              <div className={s.formHeader}>
                <h2>{t('Filter', { ns: 'other' })}</h2>
                <Cross onClick={() => setFilterModal(false)} className={s.crossIcon} />
              </div>
              <div className={s.formContainer}>
                <div className={s.inputRow}>
                  <InputField
                    inputClassName={s.input_bgc}
                    name="id"
                    label={`${t('request_id')}:`}
                    placeholder={t('Enter id', { ns: 'other' })}
                    isShadow
                    className={s.searchInput}
                    error={!!errors.email}
                    touched={!!touched.email}
                  />
                  <InputField
                    inputClassName={s.input_bgc}
                    name="message"
                    label={`${t('Contains text')}:`}
                    placeholder={t('Enter text', { ns: 'other' })}
                    isShadow
                    className={s.searchInput}
                    error={!!errors.email}
                    touched={!!touched.email}
                  />
                  <InputField
                    inputClassName={s.input_bgc}
                    name="name"
                    label={`${t('theme', { ns: 'other' })}:`}
                    placeholder={t('Enter request subject')}
                    isShadow
                    className={s.searchInput}
                    error={!!errors.email}
                    touched={!!touched.email}
                  />
                </div>
                <div className={s.selectAndBtn}>
                  <Select
                    inputClassName={s.input_bgc}
                    className={s.select}
                    placeholder={t('Not chosen', { ns: 'other' })}
                    label={`${t('The request is related to a violation')}:`}
                    value={values.abuse}
                    getElement={item => setFieldValue('abuse', item)}
                    isShadow
                    itemsList={abuseFilterList.map(({ label, value }) => ({
                      label: t(`${label.trim()}`, { ns: 'other' }),
                      value,
                    }))}
                  />

                  <SelectMultiple
                    className={s.select}
                    inputClassName={s.input_bgc}
                    placeholder={t('Select status', { ns: 'other' })}
                    label={`${t('status', { ns: 'other' })}:`}
                    value={values.tstatus}
                    getElement={item => setFieldValue('tstatus', item)}
                    isShadow
                    itemsList={statusFilterList.map(({ label, value }) => ({
                      label: t(`${label.trim()}`),
                      value,
                    }))}
                  />

                  <div className={s.timeSelectBlock}>
                    <Select
                      inputClassName={s.input_bgc}
                      label={`${t('Period', { ns: 'other' })}:`}
                      value={values.message_post}
                      getElement={item => setFieldValue('message_post', item)}
                      isShadow
                      itemsList={timeFilterList.map(({ label, value }) => ({
                        label: t(`${label.trim()}`, { ns: 'other' }),
                        value,
                      }))}
                      className={cn(s.select, s.dateSelect)}
                    />

                    <div className={s.calendarBlock}>
                      <IconButton
                        className={s.calendarBtn}
                        onClick={() => setIsOpenedCalendar(!isOpenedCalendar)}
                        icon="calendar"
                      />
                      <div
                        ref={dropdownCalendar}
                        className={cn(s.calendarModal, { [s.opened]: isOpenedCalendar })}
                      >
                        <CalendarModal
                          pointerClassName={s.calendar_pointer}
                          value={dates}
                          setStartDate={item => {
                            setFieldValue('message_poststart', item)
                            setFieldValue('message_post', 'other')
                          }}
                          setEndDate={item => setFieldValue('message_postend', item)}
                          range={values?.message_poststart?.length !== 0}
                        />
                      </div>
                    </div>
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

Component.propTypes = {
  setFilterModal: PropTypes.func,
  setCurrentPage: PropTypes.func,
  filterModal: PropTypes.bool,
}

Component.defaultProps = {
  setFilterModal: () => null,
  setCurrentPage: () => null,
}
