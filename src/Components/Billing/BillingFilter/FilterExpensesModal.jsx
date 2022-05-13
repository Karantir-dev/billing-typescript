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

  const expensesFilterList = useSelector(billingSelectors.getExpensesFiltersList)
  const expensesFilter = useSelector(billingSelectors.getExpensesFilters)

  console.log(expensesFilter)

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
    dispatch(billingOperations.setExpensesFilters(values))
  }

  const resetFilterHandler = setValues => {
    const clearField = {
      id: '',
      locale_name: '',
      item: '',
      compare_type: 'null',
      amount: '',
      fromdate: '',
      todate: '',
    }
    setCurrentPage(1)
    setValues({ ...clearField })
    setFilterModal(false)
    dispatch(billingOperations.setExpensesFilters(clearField))
  }

  return (
    <div ref={modal} className={s.filterModal}>
      <Formik
        enableReinitialize
        initialValues={{
          id: expensesFilter?.id || '',
          locale_name: expensesFilter?.locale_name || '',
          item: expensesFilter?.item || '',
          compare_type: expensesFilter?.compare_type || 'null',
          amount: expensesFilter?.amount || '',
          fromdate: expensesFilter?.fromdate || '',
          todate: expensesFilter?.todate || '',
        }}
        onSubmit={filterHandler}
      >
        {({ setFieldValue, setValues, values, errors, touched }) => {
          let dates = null
          if (values.fromdate && values.todate) {
            dates = [new Date(values.fromdate), new Date(values.todate)]
          } else if (values.fromdate) {
            dates = new Date(values.fromdate)
          }
          return (
            <Form className={cn(s.form, s.expenses)}>
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
                  name="locale_name"
                  label={`${t('Name')}:`}
                  placeholder={t('Enter the title')}
                  isShadow
                  className={s.input}
                  error={!!errors.locale_name}
                  touched={!!touched.locale_name}
                />

                <InputField
                  inputWrapperClass={s.inputHeight}
                  name="item"
                  label={`${t('Service code')}:`}
                  placeholder={t('Enter code')}
                  isShadow
                  className={s.input}
                  error={!!errors.item}
                  touched={!!touched.item}
                />

                <Select
                  label={`${t('Sum comparison type')}:`}
                  placeholder={t('Not selected')}
                  value={values.compare_type}
                  getElement={item => setFieldValue('compare_type', item)}
                  isShadow
                  itemsList={expensesFilterList?.compare_type?.map(({ $key, $ }) => ({
                    label: t(`${$.trim()}`),
                    value: $key,
                  }))}
                  className={s.select}
                />

                <InputField
                  inputWrapperClass={s.inputHeight}
                  name="amount"
                  label={`${t('Sum', { ns: 'other' })}:`}
                  placeholder={t('Not selected')}
                  isShadow
                  className={s.input}
                  error={!!errors.email}
                  touched={!!touched.email}
                />

                <div className={s.timeSelectBlock}>
                  <div className={s.calendarBlock}>
                    <IconButton
                      onClick={() => setIsOpenedCalendar(!isOpenedCalendar)}
                      icon="calendar"
                      className={s.calendarBtn}
                    />
                    <div
                      ref={dropdownCalendar}
                      className={cn(s.calendarModal, s.expenses, {
                        [s.opened]: isOpenedCalendar,
                      })}
                    >
                      <CalendarModal
                        pointerClassName={s.calendar_pointer}
                        value={dates}
                        setStartDate={item => {
                          setFieldValue('fromdate', item)
                        }}
                        setEndDate={item => setFieldValue('todate', item)}
                        range={values?.fromdate?.length !== 0}
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
