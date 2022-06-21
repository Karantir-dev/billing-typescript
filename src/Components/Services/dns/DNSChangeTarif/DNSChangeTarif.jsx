import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { Formik, Form } from 'formik'

import s from './DNSChangeTarif.module.scss'
// import InputField from '../../../ui/InputField/InputField'
// import Select from '../../../ui/Select/Select'
import { Button, RadioButton } from '../../..'
// import { translatePeriod } from '../../DedicatedServers/EditServerModal/EditServerModal'
// import { dnsOperations } from '../../../../Redux'

export default function DNSChangeTarif({ elid, closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other', 'crumbs', 'dns'])
  //   const dispatch = useDispatch()
  const [
    initialState,
    // setInitialState
  ] = useState()
  //   const [currentLimit, setCurrentLimit] = useState(null)
  //   const [additionalText, setAdditionalText] = useState('')

  const handleEditionModal = () => {
    closeFn()
  }

  //   useEffect(() => {
  //     dispatch(dnsOperations.getCurrentDNSInfo(elid, setInitialState))
  //   }, [])

  const handleSubmit = values => {
    // const { elid, autoprolong, addon_961 } = values

    console.log('values', values)
    console.log(handleEditionModal)

    // if (
    //   currentLimit === null ||
    //   currentLimit === initialState?.addon_961_current_value?.$
    // ) {
    //   dispatch(dnsOperations.editDNS(elid, autoprolong, handleEditionModal))
    // } else {
    //   dispatch(
    //     dnsOperations.editDNSWithExtraCosts(
    //       elid,
    //       autoprolong,
    //       addon_961,
    //       handleEditionModal,
    //     ),
    //   )
    // }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        elid,
        ticked_radio: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => {
        console.log(values)
        return (
          <Form className={s.form}>
            <div className={s.parameters_block}>
              <div className={s.header_block}>
                <div className={s.title_wrapper}>
                  <h2 className={s.page_title}>{t('DNS tariff', { ns: 'other' })}</h2>
                  <span className={s.order_id}>{`(#${initialState?.id?.$})`}</span>
                </div>
                <Cross
                  className={s.icon_cross}
                  onClick={e => {
                    e.preventDefault()
                    closeFn()
                  }}
                  width={17}
                  height={17}
                />
              </div>

              <div className={s.status_wrapper}>
                <div className={s.creation_date_wrapper}>
                  <span className={s.label}>{t('created', { ns: 'vds' })}:</span>
                  <span className={s.value}>{initialState?.createdate?.$}</span>
                </div>
                <div className={s.expiration_date_wrapper}>
                  <span className={s.label}>{t('valid_until', { ns: 'vds' })}:</span>
                  <span className={s.value}>{initialState?.expiredate?.$}</span>
                </div>
              </div>

              <div className={s.parameters_wrapper}>
                <div className={s.main_block}>
                  <div>
                    <RadioButton
                      name="ticked_radio"
                      value="new"
                      label={'lable'}
                      setFieldValue={setFieldValue}
                      selected={values?.ticked_radio}
                    />
                    <RadioButton
                      name="ticked_radio"
                      value="old"
                      label={'lable'}
                      setFieldValue={setFieldValue}
                      selected={values?.ticked_radio}
                    />
                  </div>
                  {/* <Select
                    height={50}
                    value={values.autoprolong}
                    label={t('autoprolong')}
                    getElement={item => setFieldValue('autoprolong', item)}
                    isShadow
                    itemsList={initialState?.autoprolongList?.val?.map(el => {
                      return {
                        // label: translatePeriod(el?.$, t),
                        label: el?.$,
                        value: el.$key,
                      }
                    })}
                    className={s.select}
                  />
                  <InputField
                    label={t('payment_method', { ns: 'vds' })}
                    name="payment_method"
                    isShadow
                    className={s.input_field_wrapper}
                    inputClassName={s.input}
                    autoComplete
                    type="text"
                    value={values?.payment_method}
                    disabled
                  />

                  <InputField
                    label={`${t('user_name', { ns: 'vds' })}:`}
                    name="username"
                    isShadow
                    className={s.input_field_wrapper}
                    inputClassName={s.input}
                    autoComplete
                    type="text"
                    value={values?.username}
                    disabled
                  />
                  <InputField
                    label={`${t('Password')}:`}
                    name="password"
                    isShadow
                    className={s.input_field_wrapper}
                    inputClassName={s.input}
                    autoComplete
                    type="text"
                    value={values?.password}
                    disabled
                  />
                  <InputField
                    label={`${t('IP-address', { ns: 'crumbs' })}:`}
                    name="ip"
                    isShadow
                    className={s.input_field_wrapper}
                    inputClassName={s.input}
                    autoComplete
                    type="text"
                    value={values?.ip}
                    disabled
                  />*/}
                </div>
              </div>

              <div className={s.btns_wrapper}>
                <Button
                  className={s.buy_btn}
                  isShadow
                  size="medium"
                  label={t('Save', { ns: 'other' })}
                  type="submit"
                />

                {/* <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('Proceed', { ns: 'other' })}
                    type="submit"
                  /> */}

                {/* <Button
                  className={s.buy_btn}
                  isShadow
                  size="medium"
                  label={t('Save', { ns: 'other' })}
                  type="submit"
                /> */}

                <button
                  onClick={e => {
                    e.preventDefault()
                    closeFn()
                  }}
                  className={s.cancel_btn}
                >
                  {t('Cancel', { ns: 'other' })}
                </button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
