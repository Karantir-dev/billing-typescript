import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useOutsideAlerter } from '../../../../utils'
import { Formik, Form } from 'formik'
import { InputField, Select, Button, DoubleInputField } from '../../..'
import { Cross } from '../../../../images'
import s from './SharedHostingFilterModal.module.scss'

export default function Component(props) {
  const {
    setFilterModal,
    filterModal,
    filters,
    filtersList,
    resetFilterHandler,
    setFilterHandler,
  } = props

  const { t } = useTranslation(['domains', 'other', 'billing'])
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
          id: filters?.id || '',
          ip: filters?.ip || '',
          domain: filters?.domain || '',
          pricelist: filters?.pricelist || '',
          period: filters?.period || '',
          status: filters?.status || '',
          service_status: filters?.service_status || '',
          opendate: filters?.opendate || '',
          expiredate: filters?.expiredate || '',
          orderdatefrom: filters?.orderdatefrom || '',
          orderdateto: filters?.orderdateto || '',
          cost_from: filters?.cost_from || '',
          cost_to: filters?.cost_to || '',
          autoprolong: filters?.autoprolong || '',
          datacenter: filters?.datacenter || '',
        }}
        onSubmit={setFilterHandler}
      >
        {({ setFieldValue, values, errors, touched }) => {
          let dates = null
          if (values.opendate && values.expiredate) {
            dates = [new Date(values.opendate), new Date(values.expiredate)]
          } else if (values.opendate) {
            dates = new Date(values.opendate)
          }

          let datesOrdered = null
          if (values.orderdatefrom && values.orderdateto) {
            datesOrdered = [new Date(values.orderdatefrom), new Date(values.orderdateto)]
          } else if (values.orderdatefrom) {
            datesOrdered = new Date(values.orderdatefrom)
          }

          return (
            <Form>
              <div className={s.formHeader}>
                <h2>{t('Filter', { ns: 'other' })}</h2>
                <Cross onClick={() => setFilterModal(false)} className={s.crossIcon} />
              </div>
              <div className={s.form}>
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
                    name="domain"
                    label={`${t('Domain name')}:`}
                    placeholder={t('Enter domain name')}
                    isShadow
                    className={s.input}
                    error={!!errors.domain}
                    touched={!!touched.domain}
                  />

                  <InputField
                    inputWrapperClass={s.inputHeight}
                    name="ip"
                    label={`${t('IP address')}:`}
                    placeholder={t('Enter IP address')}
                    isShadow
                    className={s.input}
                    error={!!errors.ip}
                    touched={!!touched.ip}
                  />

                  <Select
                    label={`${t('Tariff plan')}:`}
                    placeholder={t('Not selected')}
                    value={values.pricelist}
                    getElement={item => setFieldValue('pricelist', item)}
                    isShadow
                    itemsList={filtersList?.pricelist?.map(({ $key, $ }) => ({
                      label: t(`${$.trim()}`, { ns: 'other' }),
                      value: $key,
                    }))}
                    className={s.select}
                    inputClassName={s.select_wrapper}
                    hasNotSelectedOption
                  />

                  <Select
                    label={`${t('Period', { ns: 'other' })}:`}
                    placeholder={t('Not selected')}
                    value={values.period}
                    getElement={item => setFieldValue('period', item)}
                    isShadow
                    itemsList={filtersList?.period?.map(({ $key, $ }) => ({
                      label: t(`${$.trim()}`, { ns: 'other' }),
                      value: $key,
                    }))}
                    className={s.select}
                    inputClassName={s.select_wrapper}
                    hasNotSelectedOption
                  />

                  <Select
                    label={`${t('status', { ns: 'other' })}:`}
                    placeholder={t('Not selected')}
                    value={values.status}
                    getElement={item => setFieldValue('status', item)}
                    isShadow
                    itemsList={filtersList?.status?.map(({ $key, $ }) => ({
                      label: t(`${$.trim()}`, { ns: 'other' }),
                      value: $key,
                    }))}
                    className={s.select}
                    inputClassName={s.select_wrapper}
                    hasNotSelectedOption
                  />

                  <Select
                    label={`${t('Data center')}:`}
                    placeholder={t('Not selected')}
                    value={values.datacenter}
                    getElement={item => setFieldValue('datacenter', item)}
                    isShadow
                    itemsList={filtersList?.datacenter?.map(({ $key, $ }) => ({
                      label: t(`${$.trim()}`),
                      value: $key,
                    }))}
                    className={s.select}
                    inputClassName={s.select_wrapper}
                    hasNotSelectedOption
                  />

                  <Select
                    label={`${t('Auto renewal')}:`}
                    placeholder={t('Not selected')}
                    value={values.autoprolong}
                    getElement={item => setFieldValue('autoprolong', item)}
                    isShadow
                    itemsList={filtersList?.autoprolong?.map(({ $key, $ }) => ({
                      label: t(`${$.trim()}`),
                      value: $key,
                    }))}
                    className={s.select}
                    inputClassName={s.select_wrapper}
                    hasNotSelectedOption
                  />

                  <DoubleInputField
                    inputWrapperClass={s.inputHeight}
                    className={s.input}
                    nameLeft="cost_from"
                    nameRight="cost_to"
                    valueLeft={values?.cost_from}
                    onChangeLeft={e => setFieldValue('cost_from', e?.target.value)}
                    valueRight={values?.cost_to}
                    onChangeRight={e => setFieldValue('cost_to', e?.target.value)}
                    label={`${t('Cost (from/to)', { ns: 'other' })}:`}
                    placeholderLeft="0.00"
                    placeholderRight="0.00"
                    textLeft="EUR"
                    textRight="EUR"
                    maxLengthLeft={5}
                    maxLengthRight={5}
                    isShadow
                  />

                  <DoubleInputField
                    inputWrapperClass={s.inputHeightExpire}
                    className={s.input}
                    nameLeft="opendate"
                    nameRight="expiredate"
                    valueLeft={values?.opendate}
                    onChangeLeft={() => null}
                    valueRight={values?.expiredate}
                    onChangeRight={() => null}
                    label={`${t('Valid (from/to)', { ns: 'other' })}:`}
                    placeholderLeft="00/00/00"
                    placeholderRight="00/00/00"
                    isCalendar
                    dates={dates}
                    range={values.opendate?.length !== 0}
                    setFieldValue={setFieldValue}
                    isShadow
                  />

                  <DoubleInputField
                    inputWrapperClass={s.inputHeighOrder}
                    className={s.input}
                    nameLeft="orderdatefrom"
                    nameRight="orderdateto"
                    valueLeft={values?.orderdatefrom}
                    onChangeLeft={() => null}
                    valueRight={values?.orderdateto}
                    onChangeRight={() => null}
                    label={`${t('Order date (from/to)', { ns: 'other' })}:`}
                    placeholderLeft="00/00/00"
                    placeholderRight="00/00/00"
                    isCalendar
                    dates={datesOrdered}
                    range={values.orderdatefrom?.length !== 0}
                    setFieldValue={setFieldValue}
                    isShadow
                  />
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
                  onClick={() => resetFilterHandler()}
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
