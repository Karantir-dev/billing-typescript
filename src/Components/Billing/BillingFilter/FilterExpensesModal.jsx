import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import { useOutsideAlerter } from '../../../utils'
// import { useParams } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { InputField, Select, IconButton, CalendarModal, Button } from '../..'
import { supportSelectors } from '../../../Redux'
import s from './BillingFilter.module.scss'
import {} from '../../../images'

export default function Component(props) {
  const { setFilterModal, setCurrentPage, filterModal } = props
  const { t } = useTranslation(['billing', 'other'])
  // const dispatch = useDispatch()
  // const params = useParams()

  const timeFilterList = useSelector(supportSelectors.getTimeFilterList)

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

  const filterHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)
    console.log(values)
  }

  const resetFilterHandler = setValues => {
    const clearField = {
      id: '',
      number: '',
      sender: '',
      sender_id: '',
      recipient: '',
      paymethod: '',
      status: '',
      createdate: 'nodate',
      createdatestart: '',
      createdateend: '',
    }
    setCurrentPage(1)
    setValues({ ...clearField })
    setFilterModal(false)
  }

  return (
    <div ref={modal} className={s.filterModal}>
      <Formik
        enableReinitialize
        initialValues={{
          id: '',
          number: '',
          sender: '',
          sender_id: '',
          recipient: '',
          paymethod: '',
          status: '',
          createdate: 'nodate',
          createdatestart: '',
          createdateend: '',
          restrictrefund: '',
        }}
        onSubmit={filterHandler}
      >
        {({ setFieldValue, setValues, values, errors, touched }) => {
          let dates = null
          if (values.message_poststart && values.message_postend) {
            dates = [new Date(values.message_poststart), new Date(values.message_postend)]
          } else if (values.message_poststart) {
            dates = new Date(values.message_poststart)
          }
          return (
            <Form className={cn(s.form, s.expenses)}>
              <div className={s.fieldsBlock}>
                <InputField
                  inputWrapperClass={s.inputHeight}
                  name="id"
                  label={`${t('Id')}:`}
                  placeholder={t('Enter id', { ns: 'other' })}
                  isShadow
                  className={s.input}
                  error={!!errors.id}
                  touched={!!touched.id}
                />

                <InputField
                  inputWrapperClass={s.inputHeight}
                  name="number"
                  label={`${t('Payment number')}:`}
                  placeholder={t('Enter payment number')}
                  isShadow
                  className={s.input}
                  error={!!errors.number}
                  touched={!!touched.number}
                />

                <InputField
                  inputWrapperClass={s.inputHeight}
                  name="sender"
                  label={`${t('Payer')}:`}
                  placeholder={t('Not selected')}
                  isShadow
                  className={s.input}
                  error={!!errors.sender}
                  touched={!!touched.sender}
                />

                <Select
                  label={`${t('status', { ns: 'other' })}:`}
                  placeholder={t('Not selected')}
                  value={values.message_post}
                  getElement={item => setFieldValue('status', item)}
                  isShadow
                  itemsList={timeFilterList.map(({ label, value }) => ({
                    label: t(`${label.trim()}`, { ns: 'other' }),
                    value,
                  }))}
                  className={s.select}
                />

                <InputField
                  inputWrapperClass={s.inputHeight}
                  name="sum"
                  label={`${t('Sum', { ns: 'other' })}:`}
                  placeholder={t('Not selected')}
                  isShadow
                  className={s.input}
                  error={!!errors.email}
                  touched={!!touched.email}
                />

                <div className={s.timeSelectBlock}>
                  <Select
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
                      onClick={() => setIsOpenedCalendar(!isOpenedCalendar)}
                      icon="calendar"
                      className={s.calendarBtn}
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
