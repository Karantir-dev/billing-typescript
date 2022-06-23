import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useOutsideAlerter } from '../../../../utils'
import { Formik, Form } from 'formik'
import { InputField, Select, Button, DoubleInputField } from '../../..'
import { Cross } from '../../../../images'
import cn from 'classnames'

import s from '../../Domains/DomainFiltertsModal/DomainFiltertsModal.module.scss'
import ss from './FiltersModal.module.scss'

export default function FiltersModal({
  closeFn,
  isOpened,
  filters,
  filtersList,
  resetFilterHandler,
  handleSubmit,
}) {
  const { t } = useTranslation(['domains', 'other', 'dedicated_servers', 'vds'])
  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  const dropdownCalendar = useRef(null)
  const modal = useRef(null)

  useOutsideAlerter(modal, isOpened, () => closeFn())

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, () => setIsOpenedCalendar(false))

  return (
    <div ref={modal} className={cn(ss.filters_modal, { [ss.opened]: isOpened })}>
      <Formik
        enableReinitialize
        initialValues={{
          id: filters?.id?.$ || '',
          domain: filters?.domain?.$ || '',
          ip: filters?.ip?.$ || '',
          pricelist: filters?.pricelist?.$ || '',
          period: filters?.period?.$ || '',
          status: filters?.status?.$ || '',
          opendate: filters?.opendate?.$ || '',
          expiredate: filters?.expiredate?.$ || '',
          orderdatefrom: filters?.orderdatefrom?.$ || '',
          orderdateto: filters?.orderdateto?.$ || '',
          cost_from: filters?.cost_from?.$ || '',
          cost_to: filters?.cost_to?.$ || '',
          autoprolong: filters?.autoprolong?.$ || '',
          ostemplate: filters?.ostemplate?.$ || '',
          datacenter: filters?.datacenter?.$ || '',
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, setValues, values, errors, touched }) => {
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
            <Form className={cn(s.form)}>
              <div className={ss.formHeader}>
                <h2>{t('Filter', { ns: 'other' })}</h2>
                <Cross onClick={() => closeFn()} className={s.crossIcon} />
              </div>

              <div className={s.fieldsBlock}>
                <InputField
                  inputWrapperClass={s.inputHeight}
                  inputClassName={s.input_bgc}
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
                  inputClassName={s.input_bgc}
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
                  inputClassName={s.input_bgc}
                  name="ip"
                  label={`${t('ip_address', { ns: 'vds' })}:`}
                  placeholder={t('ip_placeholder', { ns: 'dedicated_servers' })}
                  isShadow
                  className={s.input}
                  error={!!errors.ip}
                  touched={!!touched.ip}
                />

                <Select
                  dropdownClass={s.input_bgc}
                  inputClassName={s.input_bgc}
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
                />

                <Select
                  dropdownClass={s.input_bgc}
                  inputClassName={s.input_bgc}
                  label={`${t('Period', { ns: 'other' })}:`}
                  placeholder={t('Not selected')}
                  value={values.period}
                  getElement={item => setFieldValue('period', item)}
                  isShadow
                  itemsList={filtersList?.period?.map(({ $key, $ }) => ({
                    label: t($.trim(), { ns: 'other' }),
                    value: $key,
                  }))}
                  className={s.select}
                />

                <Select
                  dropdownClass={s.input_bgc}
                  inputClassName={s.input_bgc}
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
                />

                <Select
                  dropdownClass={s.input_bgc}
                  inputClassName={s.input_bgc}
                  label={`${t('ostempl', { ns: 'vds' })}:`}
                  placeholder={t('Not selected')}
                  value={values.ostemplate}
                  getElement={item => setFieldValue('ostemplate', item)}
                  isShadow
                  itemsList={filtersList?.ostemplate?.map(({ $key, $ }) => ({
                    label: t(`${$.trim()}`),
                    value: $key,
                  }))}
                  className={s.select}
                />
                <Select
                  dropdownClass={s.input_bgc}
                  inputClassName={s.input_bgc}
                  label={`${t('datacenter', { ns: 'dedicated_servers' })}:`}
                  placeholder={t('Not selected')}
                  value={values.datacenter}
                  getElement={item => setFieldValue('datacenter', item)}
                  isShadow
                  itemsList={filtersList?.datacenter
                    ?.filter(({ $key }) => $key === '2' || $key === '7' || $key === '8')
                    .map(({ $key, $ }) => ({
                      label: t(`${$.trim()}`),
                      value: $key,
                    }))}
                  className={s.select}
                />

                <Select
                  dropdownClass={s.input_bgc}
                  inputClassName={s.input_bgc}
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
                />

                <DoubleInputField
                  inputWrapperClass={cn(s.inputHeight, s.input_bgc)}
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
                  inputWrapperClass={cn(s.inputHeightExpire, s.input_bgc)}
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
                  inputWrapperClass={cn(s.inputHeight, s.input_bgc)}
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

FiltersModal.propTypes = {
  closeFn: PropTypes.func,
  isOpened: PropTypes.bool,
}

FiltersModal.defaultProps = {
  closeFn: () => null,
}
