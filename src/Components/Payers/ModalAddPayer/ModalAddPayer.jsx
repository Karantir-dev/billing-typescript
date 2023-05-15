import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import { Cross, Info } from '../../../images'
import {
  Select,
  InputField,
  Button,
  CheckBox,
  InputWithAutocomplete,
  SelectGeo,
} from '../..'
import { payersOperations, payersSelectors, authSelectors } from '../../../Redux'
import { OFERTA_URL, PRIVACY_URL } from '../../../config/config'
import s from './ModalAddPayer.module.scss'
import * as Yup from 'yup'

export default function Component(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other', 'trusted_users', 'domains'])

  const { elid, closeAddModalHandler } = props

  const dropdownDescription = useRef(null)

  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  const geoData = useSelector(authSelectors.getGeoData)

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
    address_physical: Yup.string()
      .matches(/^[^@#$%^&*!~<>]+$/, t('symbols_restricted', { ns: 'other' }))
      .matches(/(?=\d)/, t('address_error_msg', { ns: 'other' }))
      .required(t('Is a required field', { ns: 'other' })),
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
          // validateOnBlur={false}
          // validateOnChange={false}
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
                      <SelectGeo
                        setSelectFieldValue={item => setFieldValue('country', item)}
                        selectValue={values.country}
                        selectClassName={s.select}
                        countrySelectClassName={s.countrySelectItem}
                        geoData={geoData}
                        payersSelectLists={payersSelectLists}
                      />

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

                      <div className={s.nsInputBlock}>
                        <InputWithAutocomplete
                          fieldName="address_physical"
                          error={!!errors.address_physical}
                          touched={!!touched.address_physical}
                          externalValue={values.address_physical}
                          setFieldValue={val => {
                            setFieldValue('address_physical', val)
                          }}
                        />

                        <button type="button" className={s.infoBtn}>
                          <Info />
                          <div ref={dropdownDescription} className={s.descriptionBlock}>
                            {t('address_format', { ns: 'other' })}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  {payersSelectedFields?.offer_link &&
                    (payersSelectedFields?.passport_field || !elid) && (
                      <div className={s.formBlock}>
                        <div>
                          {payersSelectedFields?.offer_link && (
                            <div className={s.offerBlock}>
                              <CheckBox
                                value={values[payersSelectedFields?.offer_field]}
                                onClick={() =>
                                  setFieldValue(
                                    `${payersSelectedFields?.offer_field}`,
                                    !values[payersSelectedFields?.offer_field],
                                  )
                                }
                                className={s.checkbox}
                                error={!!errors[payersSelectedFields?.offer_field]}
                                touched={!!touched[payersSelectedFields?.offer_field]}
                              />
                              <div className={s.offerBlockText}>
                                {t('I agree with', {
                                  ns: 'payers',
                                })}{' '}
                                <a
                                  target="_blank"
                                  href={OFERTA_URL}
                                  rel="noreferrer"
                                  className={s.offerBlockLink}
                                >
                                  {t('Terms of Service', { ns: 'domains' })}
                                </a>{' '}
                                {t('and', { ns: 'domains' })}{' '}
                                <a
                                  target="_blank"
                                  href={PRIVACY_URL}
                                  rel="noreferrer"
                                  className={s.offerBlockLink}
                                >
                                  {t('Terms of the offer', { ns: 'domains' })}
                                </a>
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
