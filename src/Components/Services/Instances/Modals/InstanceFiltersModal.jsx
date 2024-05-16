import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutsideAlerter } from '@utils'
import { Formik, Form } from 'formik'
import { InputField, Select, Button, DoubleInputField, Icon, Portal } from '@components'
import cn from 'classnames'
import s from './Modals.module.scss'

export const InstanceFiltersModal = ({
  closeFn,
  isOpened,
  filters,
  filtersList,
  resetFilterHandler,
  handleSubmit,
}) => {
  const { t } = useTranslation([
    'domains',
    'dedicated_servers',
    'other',
    'vds',
    'cloud_vps',
  ])
  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  const dropdownCalendar = useRef(null)
  const modal = useRef(null)

  useOutsideAlerter(modal, isOpened, () => closeFn())

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, () => setIsOpenedCalendar(false))

  return (
    <div ref={modal} className={cn(s.filters_modal, { [s.opened]: isOpened })}>
      <Formik
        enableReinitialize
        initialValues={{
          id: filters?.id || '',
          ip: filters?.ip || '',
          pricelist: filters?.pricelist || '',
          instance_status: filters?.instance_status || '',
          orderdatefrom: filters?.orderdatefrom || '',
          orderdateto: filters?.orderdateto || '',
          cost_from: filters?.cost_from || '',
          cost_to: filters?.cost_to || '',
          datacenter: filters?.datacenter || '',
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, setValues, values, errors, touched }) => {
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
                <Icon name="Cross" onClick={() => closeFn()} className={s.crossIcon} />
              </div>
              <div className={cn(s.form)}>
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
                    placeholder={t('Not selected', { ns: 'other' })}
                    value={values.pricelist}
                    getElement={item => setFieldValue('pricelist', item)}
                    isShadow
                    itemsList={filtersList?.pricelist?.map(({ $key, $ }) => {
                      return {
                        label: t($.trim(), { ns: 'other' }),
                        value: $key,
                      }
                    })}
                    className={s.select}
                  />

                  <Select
                    dropdownClass={s.input_bgc}
                    inputClassName={s.input_bgc}
                    label={`${t('status', { ns: 'other' })}:`}
                    placeholder={t('Not selected', { ns: 'other' })}
                    value={values.instance_status}
                    getElement={item => setFieldValue('instance_status', item)}
                    isShadow
                    itemsList={filtersList?.instance_status?.map(({ $key, $ }) => ({
                      label: t($.trim(), { ns: 'cloud_vps' }),
                      value: $key,
                    }))}
                    className={s.select}
                  />

                  <Select
                    dropdownClass={s.input_bgc}
                    inputClassName={s.input_bgc}
                    label={`${t('datacenter', { ns: 'dedicated_servers' })}:`}
                    placeholder={t('Not selected', { ns: 'other' })}
                    value={values.datacenter}
                    getElement={item => setFieldValue('datacenter', item)}
                    isShadow
                    itemsList={filtersList?.datacenter
                      ?.filter(
                        ({ $key }) => $key === '12' || $key === '13' || $key === '',
                      )
                      .map(({ $key, $ }) => ({
                        label: t($.trim()),
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
              </div>
              <div className={cn(s.btnBlock)}>
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
      <Portal>
        <div className={cn(s.filter_backdrop, { [s.opened]: isOpened })}></div>
      </Portal>
    </div>
  )
}
