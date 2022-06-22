import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import s from './FTPEditModal.module.scss'
import InputField from '../../../ui/InputField/InputField'
import Select from '../../../ui/Select/Select'
import { Button } from '../../..'
import { ftpOperations } from '../../../../Redux'
import translatePeriod from '../../../../utils/translatePeriod'

export default function FTPEditModal({ elid, closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    dispatch(ftpOperations.getCurrentStorageInfo(elid, setInitialState))
  }, [])

  const handleSubmit = values => {
    const { elid, autoprolong } = values

    dispatch(ftpOperations.editFTP(elid, autoprolong, handleEditionModal))
  }

  const validationSchema = Yup.object().shape({
    domainname: Yup.string().matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
      t('licence_error'),
    ),
  })

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
        elid,
        autoprolong: initialState?.autoprolong?.$ || null,
        payment_method: initialState?.payment_method?.val[0]?.$ || '',
        ftp_server: '',
        password: initialState?.passwd?.$ || '',
        username: initialState?.user?.$ || '',
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
                  onClick={closeFn}
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
                    label={`${t('FTP server', { ns: 'other' })}:`}
                    name="ftp_server"
                    isShadow
                    className={s.input_field_wrapper}
                    inputClassName={s.input}
                    autoComplete
                    type="text"
                    value={values?.ftp_server}
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
