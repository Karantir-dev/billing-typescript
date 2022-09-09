import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import { Cross } from '../../../images'
import {
  Select,
  InputField,
  // CustomPhoneInput,
  Button,
  CheckBox,
  // SelectMultiple,
} from '../..'
import { payersOperations, payersSelectors } from '../../../Redux'
import { BASE_URL } from '../../../config/config'
import s from './ModalAddPayer.module.scss'
import * as Yup from 'yup'

export default function Component(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other', 'trusted_users'])

  const { elid, closeAddModalHandler } = props

  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  const offerTextHandler = () => {
    dispatch(payersOperations.getPayerOfferText(payersSelectedFields?.offer_link))
  }

  useEffect(() => {
    let data = {
      country: payersSelectLists?.country[0]?.$key,
      profiletype: payersSelectLists?.profiletype[0]?.$key,
    }
    if (elid) {
      data = { elid }
      dispatch(payersOperations.getPayerEditInfo(data))
      return
    }
    dispatch(payersOperations.getPayerModalInfo(data))
  }, [])

  if (!payersSelectedFields) {
    return null
  }

  const validationSchema = Yup.object().shape({
    person: Yup.string().required(t('Is a required field', { ns: 'other' })),
    // city_physical: Yup.string().required(t('Is a required field', { ns: 'other' })),
    address_physical: Yup.string().required(t('Is a required field', { ns: 'other' })),
    name:
      payersSelectedFields?.profiletype === '2' ||
      payersSelectedFields?.profiletype === '3'
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
    [payersSelectedFields?.offer_field]: elid ? null : Yup.bool().oneOf([true]),
  })

  const createPayerHandler = values => {
    let data = {
      ...values,
      name: values?.name,
      clicked_button: 'finish',
      progressid: false,
      sok: 'ok',
      [payersSelectedFields?.offer_field]: values[payersSelectedFields?.offer_field]
        ? 'on'
        : 'off',
    }
    dispatch(payersOperations.getPayerModalInfo(data, true, closeAddModalHandler))
  }

  const editPayerHandler = values => {
    let data = {
      ...values,
      country_physical: values?.country,
      sok: 'ok',
      elid: elid,
    }
    dispatch(payersOperations.getPayerEditInfo(data, true, closeAddModalHandler))
  }

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <span className={s.headerText}>
            {t(elid ? 'Edit the selected payer' : 'Adding a payer')}
          </span>
          <Cross onClick={closeAddModalHandler} className={s.crossIcon} />
        </div>
        <Formik
          enableReinitialize
          validateOnMount={false}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={validationSchema}
          initialValues={{
            country:
              payersSelectedFields?.country ||
              payersSelectedFields?.country_physical ||
              '',
            profiletype: payersSelectedFields?.profiletype || '',
            maildocs: payersSelectedFields?.maildocs || '',
            email: payersSelectedFields?.email || '',
            phone: payersSelectedFields?.phone || '',
            person: payersSelectedFields?.person || '',
            name: payersSelectedFields?.name || '',
            eu_vat: payersSelectedFields?.eu_vat || '',
            country_physical:
              payersSelectedFields?.country ||
              payersSelectedFields?.country_physical ||
              '',
            postcode_physical: payersSelectedFields?.postcode_physical || '',
            passport: payersSelectedFields?.passport || '',
            address_physical: payersSelectedFields?.address_physical || '',
            city_physical: payersSelectedFields?.city_physical || '',
            [payersSelectedFields?.offer_field]: elid ? null : false,
          }}
          onSubmit={elid ? editPayerHandler : createPayerHandler}
        >
          {({ errors, touched, setFieldValue, values }) => {
            const onProfileTypeChange = item => {
              setFieldValue('profiletype', item)
              let data = {
                country: payersSelectLists?.country[0]?.$key,
                profiletype: item,
              }
              if (elid) {
                data = { elid }
                dispatch(payersOperations.getPayerEditInfo(data))
                return
              }
              dispatch(payersOperations.getPayerModalInfo(data))
            }

            return (
              <Form>
                <div className={s.form}>
                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>1. {t('Main')}</div>
                    <div className={s.formFieldsBlock}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('Payer status')}:`}
                        value={values.profiletype}
                        getElement={item => onProfileTypeChange(item)}
                        isShadow
                        className={s.select}
                        dropdownClass={s.selectDropdownClass}
                        itemsList={payersSelectLists?.profiletype?.map(({ $key, $ }) => ({
                          label: t(`${$.trim()}`),
                          value: $key,
                        }))}
                      />

                      {values?.profiletype === '3' || values?.profiletype === '2' ? (
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="name"
                          label={`${t('Company name')}:`}
                          placeholder={t('Enter data', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.name}
                          touched={!!touched.name}
                          isRequired
                        />
                      ) : null}

                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="person"
                        label={`${t('The contact person')}:`}
                        placeholder={t('Enter data', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.person}
                        touched={!!touched.person}
                        isRequired
                      />

                      {/* <CustomPhoneInput
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
                        type="email"
                        name="email"
                        label={`${t('Email')}:`}
                        placeholder={t('Enter email', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.email}
                        touched={!!touched.email}
                      />
                      <SelectMultiple
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('Receive documents')}:`}
                        value={values.maildocs}
                        getElement={item => setFieldValue('maildocs', item)}
                        isShadow
                        className={s.select}
                        itemsList={payersSelectLists?.maildocs?.map(({ $key, $ }) => ({
                          label: t(`${$.trim()}`),
                          value: $key,
                        }))}
                      /> */}

                      {payersSelectedFields?.eu_vat_field ? (
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="eu_vat"
                          label={`${t('EU VAT-number')}:`}
                          placeholder={t('Enter data', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.eu_vat}
                          touched={!!touched.eu_vat}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>2. {t('Actual address')}</div>
                    <div className={s.formFieldsBlock}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('The country', { ns: 'other' })}:`}
                        value={values.country}
                        getElement={item => setFieldValue('country', item)}
                        isShadow
                        className={s.select}
                        itemsList={payersSelectLists?.country?.map(
                          ({ $key, $, $image }) => ({
                            label: (
                              <div className={s.countrySelectItem}>
                                <img src={`${BASE_URL}${$image}`} alt="flag" />
                                {t(`${$.trim()}`)}
                              </div>
                            ),
                            value: $key,
                          }),
                        )}
                        isRequired
                      />
                      {/* <InputField
                        inputWrapperClass={s.inputHeight}
                        name="postcode_physical"
                        label={`${t('Index', { ns: 'other' })}:`}
                        placeholder={t('Enter index', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.postcode_physical}
                        touched={!!touched.postcode_physical}
                        isRequired
                      /> */}
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="city_physical"
                        label={`${t('City', { ns: 'other' })}:`}
                        placeholder={t('Enter city', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.city_physical}
                        touched={!!touched.city_physical}
                        // isRequired
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="address_physical"
                        label={`${t('The address', { ns: 'other' })}:`}
                        placeholder={t('Enter address', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.address_physical}
                        touched={!!touched.address_physical}
                        isRequired
                      />
                    </div>
                  </div>
                  {payersSelectedFields?.offer_link &&
                    (payersSelectedFields?.passport_field || !elid) && (
                      <div className={s.formBlock}>
                        <div className={s.formBlockTitle}>
                          3. {t('Data for the contract')}
                        </div>
                        <div className={s.formFieldsBlock}>
                          {/* {payersSelectedFields?.passport_field && (
                          <InputField
                            inputWrapperClass={s.inputHeight}
                            name="passport"
                            label={`${t('Passport', { ns: 'other' })}:`}
                            placeholder={t('Series and passport number', { ns: 'other' })}
                            isShadow
                            className={s.input}
                            error={!!errors.passport}
                            touched={!!touched.passport}
                          />
                        )} */}
                          {payersSelectedFields?.offer_link && (
                            <div className={s.offerBlock}>
                              <CheckBox
                                initialState={values[payersSelectedFields?.offer_field]}
                                setValue={item =>
                                  setFieldValue(
                                    `${payersSelectedFields?.offer_field}`,
                                    item,
                                  )
                                }
                                className={s.checkbox}
                                error={!!errors[payersSelectedFields?.offer_field]}
                              />
                              <div className={s.offerBlockText}>
                                {t('I agree with the terms of the offer')}
                                <br />
                                <button
                                  onClick={offerTextHandler}
                                  type="button"
                                  className={s.offerBlockLink}
                                >
                                  {payersSelectedFields?.offer_name}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
                <div className={s.btnBlock}>
                  <Button
                    className={s.saveBtn}
                    isShadow
                    size="medium"
                    label={t(elid ? 'Save' : 'Create', { ns: 'other' })}
                    type="submit"
                  />
                  <button
                    onClick={closeAddModalHandler}
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
