import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import { Cross } from '../../../images'
import { Select, InputField, CustomPhoneInput, Button } from '../..'
import { payersOperations } from '../../../Redux'
import s from './ModalAddPayer.module.scss'

export default function Component(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other'])

  const { elid, setAddPayerModal } = props

  console.log(elid)

  useEffect(() => {
    dispatch(payersOperations.getPayerModalInfo())
  }, [])

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <span className={s.headerText}>{t('Adding a payer')}</span>
          <Cross onClick={() => setAddPayerModal(false)} className={s.crossIcon} />
        </div>
        <Formik
          enableReinitialize
          initialValues={{}}
          onSubmit={values => console.log(values)}
        >
          {({ errors, touched, setFieldValue, values, handleBlur }) => {
            return (
              <Form className={s.form}>
                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>1. {t('Main')}</div>
                  <div className={s.formFieldsBlock}>
                    <Select
                      placeholder={t('Not chosen', { ns: 'other' })}
                      label={`${t('Payer status')}:`}
                      value={values.abuse}
                      getElement={item => setFieldValue('abuse', item)}
                      isShadow
                      className={s.select}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="id"
                      label={`${t('The contact person')}:`}
                      placeholder={t('Enter data', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.email}
                      touched={!!touched.email}
                      isRequired
                    />
                    <CustomPhoneInput
                      containerClass={s.phoneInputContainer}
                      inputClass={s.phoneInputClass}
                      value={values.phone}
                      wrapperClass={s.phoneInput}
                      labelClass={s.phoneInputLabel}
                      label={`${t('Phone', { ns: 'other' })}:`}
                      dataTestid="input_phone"
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      name="phone"
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="id"
                      label={`${t('Email')}:`}
                      placeholder={t('Enter email', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.email}
                      touched={!!touched.email}
                    />
                    <Select
                      placeholder={t('Not chosen', { ns: 'other' })}
                      label={`${t('Receive documents')}:`}
                      value={values.abuse}
                      getElement={item => setFieldValue('abuse', item)}
                      isShadow
                      className={s.select}
                    />
                  </div>
                </div>
                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>2. {t('Actual address')}</div>
                  <div className={s.formFieldsBlock}>
                    <Select
                      placeholder={t('Not chosen', { ns: 'other' })}
                      label={`${t('TThe country', { ns: 'other' })}:`}
                      value={values.abuse}
                      getElement={item => setFieldValue('abuse', item)}
                      isShadow
                      className={s.select}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="id"
                      label={`${t('Index', { ns: 'other' })}:`}
                      placeholder={t('Enter index', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.email}
                      touched={!!touched.email}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="id"
                      label={`${t('City', { ns: 'other' })}:`}
                      placeholder={t('Enter city', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.email}
                      touched={!!touched.email}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="id"
                      label={`${t('The address', { ns: 'other' })}:`}
                      placeholder={t('Enter address', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.email}
                      touched={!!touched.email}
                    />
                  </div>
                </div>
                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>3. {t('Data for the contract')}</div>
                  <div className={s.formFieldsBlock}>
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="id"
                      label={`${t('Passport', { ns: 'other' })}:`}
                      placeholder={t('Series and passport number', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.email}
                      touched={!!touched.email}
                    />
                  </div>
                </div>
                <div className={s.btnBlock}>
                  <Button
                    className={s.saveBtn}
                    isShadow
                    size="medium"
                    label={t('Create', { ns: 'other' })}
                    type="submit"
                  />
                  <button
                    onClick={() => setAddPayerModal(false)}
                    type="button"
                    className={s.cancel}
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
  )
}
