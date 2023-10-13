import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import s from './FTPEditModal.module.scss'
import { Button, InputField, Select, Modal } from '@components'
import { ftpOperations } from '@redux'
import { translatePeriod } from '@utils'

export default function FTPEditModal({ elid, closeModal, isOpen }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other', 'autoprolong'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()

  const handleEditionModal = () => {
    closeModal()
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
    <Modal closeModal={closeModal} isOpen={isOpen} className={s.modal}>
      <Modal.Header>
        <div className={s.title_wrapper}>
          <h2 className={s.page_title}>{t('Editing a service', { ns: 'other' })}</h2>
          <span className={s.order_id}>{`(#${initialState?.id?.$})`}</span>
        </div>
      </Modal.Header>
      <Modal.Body>
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
              <Form id="ftp-edit">
                <div className={s.parameters_block}>
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
                        itemsList={initialState?.autoprolongList?.val?.map(el => ({
                          label: translatePeriod(el?.$, el.$key, t),
                          value: el.$key,
                        }))}
                        className={s.select}
                      />
                      <InputField
                        label={t('payment_method', { ns: 'vds' })}
                        name="payment_method"
                        isShadow
                        className={s.input_field_wrapper}
                        inputClassName={s.input}
                        autoComplete="off"
                        type="text"
                        value={values?.payment_method}
                        disabled
                      />
                      {values?.ftp_server && (
                        <InputField
                          label={`${t('FTP server', { ns: 'other' })}:`}
                          name="ftp_server"
                          isShadow
                          className={s.input_field_wrapper}
                          inputClassName={s.input}
                          autoComplete="off"
                          type="text"
                          value={values?.ftp_server}
                          disabled
                        />
                      )}

                      <InputField
                        label={`${t('user_name', { ns: 'vds' })}:`}
                        name="username"
                        isShadow
                        className={s.input_field_wrapper}
                        inputClassName={s.input}
                        autoComplete="off"
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
                        autoComplete="off"
                        type="text"
                        value={values?.password}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer column>
        <Button
          className={s.buy_btn}
          isShadow
          size="medium"
          label={t('Save', { ns: 'other' })}
          type="submit"
          form="ftp-edit"
        />
        <button
          onClick={e => {
            e.preventDefault()
            closeModal()
          }}
          className={s.cancel_btn}
        >
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
