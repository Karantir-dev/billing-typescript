import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { Formik, Form } from 'formik'

import s from './DNSEditModal.module.scss'
import InputField from '../../../ui/InputField/InputField'
import Select from '../../../ui/Select/Select'
import { Button } from '../../..'
import { translatePeriod } from '../../DedicatedServers/EditServerModal/EditServerModal'
import { dnsOperations } from '../../../../Redux'

export default function FTPEditModal({ elid, closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other', 'crumbs', 'dns'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  const [currentLimit, setCurrentLimit] = useState(null)
  const [additionalText, setAdditionalText] = useState('')

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    dispatch(dnsOperations.getCurrentDNSInfo(elid, setInitialState))
  }, [])

  const handleSubmit = values => {
    const { elid, autoprolong, addon_961 } = values

    if (
      currentLimit === null ||
      currentLimit === initialState?.addon_961_current_value?.$
    ) {
      dispatch(dnsOperations.editDNS(elid, autoprolong, handleEditionModal))
    } else {
      dispatch(
        dnsOperations.editDNSWithExtraCosts(
          elid,
          autoprolong,
          addon_961,
          handleEditionModal,
        ),
      )
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        elid,
        autoprolong: initialState?.autoprolong?.$ || null,
        payment_method: initialState?.payment_method?.val[0]?.$ || '',
        ip: initialState?.ip?.$ || '',
        password: initialState?.password?.$ || '',
        username: initialState?.username?.$ || '',
        addon_961: initialState?.addon_961_current_value?.$ || '',
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => {
        return (
          <Form className={s.form}>
            <div className={s.parameters_block}>
              <div className={s.header_block}>
                <div className={s.title_wrapper}>
                  <h2 className={s.page_title}>
                    {t('Editing a service', { ns: 'other' })}
                  </h2>
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
                  <Select
                    height={50}
                    value={values.autoprolong}
                    label={t('autoprolong')}
                    getElement={item => setFieldValue('autoprolong', item)}
                    isShadow
                    itemsList={initialState?.autoprolongList?.val?.map(el => {
                      return {
                        label: translatePeriod(el?.$, t),
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
                  />
                </div>

                {initialState?.limitsList && (
                  <Select
                    height={50}
                    value={values.addon_961.toString()}
                    label={`${t('domains_limit', { ns: 'dns' })}:`}
                    getElement={item => {
                      setFieldValue('addon_961', item)
                      setCurrentLimit(item)
                      dispatch(
                        dnsOperations.getDNSExtraPayText(
                          values.elid,
                          values.autoprolong,
                          item,
                          setAdditionalText,
                        ),
                      )
                    }}
                    isShadow
                    itemsList={initialState?.limitsList?.map(el => {
                      return {
                        label: el.toString(),
                        value: el.toString(),
                      }
                    })}
                    className={s.select}
                  />
                )}

                <div className={s.additional_text}>
                  <p>
                    {additionalText
                      ?.split('<b>')[2]
                      ?.replace('</b>', '')
                      ?.replace('Total amount', t('topay'))}
                  </p>
                  <p>
                    {additionalText
                      ?.split('<br/>')[1]
                      ?.replaceAll('Unit', t('Unit'))
                      ?.replace('Domain limit', t('Domain limit', { ns: 'dns' }))
                      ?.replace('per month', t('per month'))
                      ?.replace('additional', t('additional', { ns: 'dns' }))}
                  </p>
                </div>
              </div>

              <div className={s.btns_wrapper}>
                {currentLimit === initialState?.addon_961_current_value?.$ ||
                currentLimit === null ? (
                  <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('Save', { ns: 'other' })}
                    type="submit"
                  />
                ) : (
                  <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('Proceed', { ns: 'other' })}
                    type="submit"
                  />
                )}
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
