import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Portal, Select, Button, InputField, CheckBox } from '../../..'
import { Formik, Form } from 'formik'
import s from './SiteCareEditModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other', 'domains'])

  const { name, closeEditModalHandler, editData, sendEditSiteCareHandler } = props

  const editHandler = values => {
    const data = { ...values, sok: 'ok' }
    sendEditSiteCareHandler(data)
  }

  return (
    <Portal>
      <div className={s.modalBg}>
        <div className={s.modalBlock}>
          <div className={s.modalHeader}>
            <div className={s.headerTitleBlock}>
              <span className={s.headerText}>
                {t('Service editing', { ns: 'domains' })}
              </span>
              <span className={s.vhostName}>({name})</span>
            </div>
            <Cross onClick={closeEditModalHandler} className={s.crossIcon} />
          </div>
          <div className={s.statusBlock}>
            <div className={s.statusItem}>
              <span>{t('The service is active until')}:</span>
              <span>{editData?.createdate}</span>
            </div>
            <div className={s.statusItem}>
              <span>{t('Service extended until')}:</span>
              <span>{editData?.expiredate}</span>
            </div>
          </div>
          <Formik
            enableReinitialize
            initialValues={{
              autoprolong: editData?.autoprolong || '',
              stored_method: editData?.stored_method || '',

              ipServer: editData?.ipServer || '',
              loginServer: editData?.loginServer || '',
              passwordServer: editData?.passwordServer || '',
              port: editData?.port || '',
              url: editData?.url || '',
              pause: editData?.pause || '',
            }}
            onSubmit={editHandler}
          >
            {({ setFieldValue, values, errors, touched }) => {
              return (
                <Form className={s.form}>
                  <div className={s.fieldsBlock}>
                    <Select
                      label={`${t('Auto renewal', { ns: 'domains' })}:`}
                      placeholder={t('Not selected')}
                      value={values.autoprolong}
                      getElement={item => setFieldValue('autoprolong', item)}
                      isShadow
                      itemsList={editData?.autoprolong_list?.map(({ $key, $ }) => ({
                        label: $.trim(),
                        value: $key,
                      }))}
                      className={s.select}
                    />

                    {values?.autoprolong && values?.autoprolong !== 'null' && (
                      <Select
                        label={`${t('Payment method', { ns: 'domains' })}:`}
                        placeholder={t('Not selected')}
                        value={values.stored_method}
                        getElement={item => setFieldValue('stored_method', item)}
                        isShadow
                        itemsList={editData?.stored_method_list?.map(({ $key, $ }) => ({
                          label: $.trim(),
                          value: $key,
                        }))}
                        className={s.select}
                      />
                    )}
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'loginServer'}
                      label={`${t('Login')}:`}
                      isShadow
                      className={s.input}
                      error={!!errors.loginServer}
                      touched={!!touched.loginServer}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'passwordServer'}
                      label={`${t('Password')}:`}
                      isShadow
                      className={s.input}
                      error={!!errors.passwordServer}
                      touched={!!touched.passwordServer}
                    />

                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'url'}
                      label={`${t('Site URL')}:`}
                      isShadow
                      className={s.input}
                      disabled
                      error={!!errors.url}
                      touched={!!touched.url}
                    />

                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'port'}
                      label={`${t('Port')}:`}
                      isShadow
                      className={s.input}
                      error={!!errors.port}
                      touched={!!touched.port}
                    />

                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'ipServer'}
                      label={`${t('IP address')}:`}
                      isShadow
                      className={s.input}
                      error={!!errors.ipServer}
                      touched={!!touched.ipServer}
                    />

                    <div className={s.useFirstCheck}>
                      <CheckBox
                        initialState={editData?.pause === 'on'}
                        setValue={item => {
                          setFieldValue('pause', item ? 'on' : 'off')
                        }}
                        className={s.checkbox}
                      />
                      <span>{t('Pause site check')}</span>
                    </div>
                  </div>

                  <div className={s.btnBlock}>
                    <Button
                      className={s.searchBtn}
                      isShadow
                      size="medium"
                      label={t('Save', { ns: 'other' })}
                      type="submit"
                    />
                    <button
                      onClick={closeEditModalHandler}
                      type="button"
                      className={s.clearFilters}
                    >
                      {t('Cancel', { ns: 'other' })}
                    </button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>
    </Portal>
  )
}
