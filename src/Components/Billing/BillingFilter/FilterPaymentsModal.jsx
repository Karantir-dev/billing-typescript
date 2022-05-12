import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import { useOutsideAlerter } from '../../../utils'
import { Formik, Form } from 'formik'
import { InputField, Select, IconButton, CalendarModal, Button } from '../..'
import { billingOperations, billingSelectors } from '../../../Redux'
import s from './BillingFilter.module.scss'
import { Cross } from '../../../images'

export default function Component(props) {
  const { setFilterModal, setCurrentPage, filterModal } = props
  const { t } = useTranslation(['billing', 'other'])
  const dispatch = useDispatch()

  const paymentsFiltersList = useSelector(billingSelectors.getPaymentsFiltersList)

  const paymentsFilter = useSelector(billingSelectors.getPaymentsFilters)

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

    values.saamount_from = values.sum
    values.saamount_to = values.sum
    dispatch(billingOperations.setPaymentsFilters(values))
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
      saamount_from: '',
      saamount_to: '',
    }
    setCurrentPage(1)
    setValues({ ...clearField })
    setFilterModal(false)
    dispatch(billingOperations.setPaymentsFilters(clearField))
  }

  return (
    <div ref={modal} className={s.filterModal}>
      <Formik
        enableReinitialize
        initialValues={{
          id: paymentsFilter?.id || '',
          number: paymentsFilter?.number || '',
          sender: paymentsFilter?.sender || '',
          sender_id: paymentsFilter?.sender_id || '',
          recipient: paymentsFilter?.recipient || '',
          paymethod: paymentsFilter?.paymethod || '',
          status: paymentsFilter?.status || '',
          createdate: paymentsFilter?.createdate || 'nodate',
          createdatestart: paymentsFilter?.createdatestart || '',
          createdateend: paymentsFilter?.createdateend || '',
          restrictrefund: paymentsFilter?.restrictrefund || '',
          sum: paymentsFilter?.saamount_from || '',
        }}
        onSubmit={filterHandler}
      >
        {({ setFieldValue, setValues, values, errors, touched }) => {
          let dates = null
          if (values.createdatestart && values.createdateend) {
            dates = [new Date(values.createdatestart), new Date(values.createdateend)]
          } else if (values.createdatestart) {
            dates = new Date(values.createdatestart)
          }
          return (
            <Form className={s.form}>
              <div className={s.formHeader}>
                <h2>{t('Filter', { ns: 'other' })}</h2>
                <Cross onClick={() => setFilterModal(false)} className={s.crossIcon} />
              </div>
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
                  label={`${t('Recipient')}:`}
                  placeholder={t('Not selected')}
                  value={values.recipient}
                  getElement={item => setFieldValue('recipient', item)}
                  isShadow
                  itemsList={paymentsFiltersList?.recipient?.map(({ $key, $ }) => ({
                    label: t(`${$.trim()}`, { ns: 'other' }),
                    value: $key,
                  }))}
                  className={s.select}
                />

                <InputField
                  inputWrapperClass={s.inputHeight}
                  name="sender_id"
                  label={`${t('Payer codes')}:`}
                  placeholder={t('Enter codes')}
                  isShadow
                  className={s.input}
                  error={!!errors.sender_id}
                  touched={!!touched.sender_id}
                />

                <Select
                  label={`${t('status', { ns: 'other' })}:`}
                  placeholder={t('Not selected')}
                  value={values.status}
                  getElement={item => setFieldValue('status', item)}
                  isShadow
                  itemsList={paymentsFiltersList?.status?.map(({ $key, $ }) => ({
                    label: t(`${$.trim()}`),
                    value: $key,
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
                  error={!!errors.sum}
                  touched={!!touched.sum}
                />

                <Select
                  label={`${t('Payment method')}:`}
                  placeholder={t('Not selected')}
                  value={values.paymethod}
                  getElement={item => setFieldValue('paymethod', item)}
                  isShadow
                  itemsList={paymentsFiltersList?.paymethod?.map(({ $key, $ }) => ({
                    label: t(`${$.trim()}`, { ns: 'other' }),
                    value: $key,
                  }))}
                  className={s.select}
                />

                <Select
                  label={`${t('Refund')}:`}
                  placeholder={t('Not selected')}
                  value={values.restrictrefund}
                  getElement={item => setFieldValue('restrictrefund', item)}
                  isShadow
                  itemsList={paymentsFiltersList?.restrictrefund?.map(({ $key, $ }) => ({
                    label: t(`${$.trim()}`),
                    value: $key,
                  }))}
                  className={s.select}
                />

                <div className={s.timeSelectBlock}>
                  <Select
                    label={`${t('Period', { ns: 'other' })}:`}
                    value={values.createdate}
                    getElement={item => setFieldValue('createdate', item)}
                    isShadow
                    itemsList={paymentsFiltersList?.createdate?.map(({ $key, $ }) => ({
                      label: t(`${$.trim()}`, { ns: 'other' }),
                      value: $key,
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
                          setFieldValue('createdatestart', item)
                          setFieldValue('createdate', 'other')
                        }}
                        setEndDate={item => setFieldValue('createdateend', item)}
                        range={values?.createdatestart?.length !== 0}
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
