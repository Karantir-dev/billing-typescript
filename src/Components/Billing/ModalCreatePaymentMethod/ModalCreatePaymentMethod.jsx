import React, { useEffect, useState, useRef } from 'react'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, useFormikContext } from 'formik'
import { Cross, Info } from '../../../images'
import {
  Button,
  Select,
  InputField,
  CheckBox,
  InputWithAutocomplete,
  SelectGeo,
} from '../..'
import {
  billingOperations,
  billingSelectors,
  payersOperations,
  payersSelectors,
  authSelectors,
} from '../../../Redux'
import { BASE_URL, OFERTA_URL, PRIVACY_URL } from '../../../config/config'
import * as Yup from 'yup'

import s from './ModalCreatePaymentMethod.module.scss'
import { checkIfTokenAlive } from '../../../utils'

export default function Component(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['billing', 'other', 'payers', 'cart', 'domains'])

  const { setCreatePaymentModal } = props

  const payersList = useSelector(payersSelectors.getPayersList)

  const paymentsMethodList = useSelector(billingSelectors.getPaymentsMethodList)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)

  const geoData = useSelector(authSelectors.getGeoData)

  const paymentsCurrency = useSelector(billingSelectors.getPaymentsCurrencyList)

  const dropdownDescription = useRef(null)

  const [selectedPayerFields, setSelectedPayerFields] = useState(null)

  useEffect(() => {
    dispatch(billingOperations.getPayers())
  }, [])

  useEffect(() => {
    if (payersList && payersSelectLists) {
      let data = {
        country: payersSelectLists?.country[0]?.$key,
        profiletype: payersSelectLists?.profiletype[0]?.$key,
      }
      if (payersList?.length !== 0) {
        data = { elid: payersList[payersList?.length - 1]?.id?.$ }
        dispatch(
          payersOperations.getPayerEditInfo(data, false, null, setSelectedPayerFields),
        )
        return
      }
      dispatch(
        payersOperations.getPayerModalInfo(data, false, null, setSelectedPayerFields),
      )
    }
  }, [payersList, payersSelectLists])

  // const offerTextHandler = () => {
  //   dispatch(payersOperations.getPayerOfferText(selectedPayerFields?.offer_link))
  // }

  const createPaymentMethodHandler = values => {
    const data = {
      postcode_physical: values?.postcode_physical,
      eu_vat: values?.eu_vat,
      city_legal: values?.city_physical,
      city_physical: values?.city_physical,
      address_legal: values?.address_physical,
      address_physical: values?.address_physical,
      postcode: values?.postcode_physical,
      city: values?.city_physical,
      address: values?.address_physical,
      country_physical:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      country_legal:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      profile: values?.profile === 'new' ? 'add_new' : values?.profile,
      paymethod: '57',
      country:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      profiletype: values?.profiletype || '',
      person:
        payersList?.find(e => e?.id?.$ === values?.profile)?.name?.$ ||
        values?.person ||
        ' ',
      director:
        payersList?.find(e => e?.id?.$ === values?.profile)?.name?.$ ||
        values?.person ||
        ' ',
      name: values?.person,
      offer_3: values['offer_3'] ? 'on' : 'off',
    }

    dispatch(billingOperations.finishAddPaymentMethod(data))
  }

  const validationSchema = Yup.object().shape({
    profile: payersList?.length !== 0 ? Yup.string().required(t('Choose payer')) : null,

    slecetedPayMethod: Yup.string().required(t('Select a Payment Method')),
    // city_physical: Yup.string().required(t('Is a required field', { ns: 'other' })),
    address_physical: Yup.string()
      .matches(/^[^@#$%^&*!~<>]+$/, t('symbols_restricted', { ns: 'other' }))
      .matches(/(?=\d)/, t('address_error_msg', { ns: 'other' }))
      .required(t('Is a required field', { ns: 'other' })),
    person: Yup.string().required(t('Is a required field', { ns: 'other' })),
    name:
      payersSelectedFields?.profiletype === '2' ||
      payersSelectedFields?.profiletype === '3'
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
    offer_3: selectedPayerFields?.offer_field ? Yup.bool().oneOf([true]) : null,
  })

  return (
    <div className={s.modalBg}>
      {payersSelectedFields && selectedPayerFields && payersSelectLists && (
        <div className={s.modalBlock}>
          <div className={s.modalHeader}>
            <span className={s.headerText}>{t('New payment method')}</span>
            <Cross onClick={() => setCreatePaymentModal(false)} className={s.crossIcon} />
          </div>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={{
              profile:
                selectedPayerFields?.profile || payersList[payersList?.length - 1]?.id?.$,
              slecetedPayMethod: '57',
              name: selectedPayerFields?.name || '',
              address_physical: selectedPayerFields?.address_physical || '',
              city_physical:
                selectedPayerFields?.city_physical || geoData?.clients_city || '',
              person: selectedPayerFields?.person || '',
              country:
                payersSelectedFields?.country ||
                payersSelectedFields?.country_physical ||
                '',
              profiletype: payersSelectedFields?.profiletype,
              eu_vat: selectedPayerFields?.eu_vat || '',
              offer_3: false,
              payment_currency: {
                title: paymentsCurrency?.payment_currency_list?.filter(
                  e => e?.$key === paymentsCurrency?.payment_currency,
                )[0]?.$,
                value: paymentsCurrency?.payment_currency,
              },
            }}
            onSubmit={createPaymentMethodHandler}
          >
            {({ values, setFieldValue, touched, errors }) => {
              const getFieldErrorNames = formikErrors => {
                const transformObjectToDotNotation = (obj, prefix = '', result = []) => {
                  Object.keys(obj).forEach(key => {
                    const value = obj[key]
                    if (!value) return

                    const nextKey = prefix ? `${prefix}.${key}` : key
                    if (typeof value === 'object') {
                      transformObjectToDotNotation(value, nextKey, result)
                    } else {
                      result.push(nextKey)
                    }
                  })

                  return result
                }

                return transformObjectToDotNotation(formikErrors)
              }

              const ScrollToFieldError = ({
                scrollBehavior = { behavior: 'smooth', block: 'center' },
              }) => {
                const { submitCount, isValid, errors } = useFormikContext()

                useEffect(() => {
                  if (isValid) return

                  const fieldErrorNames = getFieldErrorNames(errors)
                  if (fieldErrorNames.length <= 0) return

                  const element = document.querySelector(
                    `input[name='${fieldErrorNames[0]}']`,
                  )
                  if (!element) return

                  try {
                    element.scrollIntoView(scrollBehavior)
                  } catch (e) {
                    checkIfTokenAlive(e?.message, dispatch)
                  }
                }, [submitCount])

                return null
              }

              const setPayerHandler = val => {
                setFieldValue('profile', val)
                let data = null
                if (val === 'new') {
                  data = {
                    country: payersSelectLists?.country[0]?.$key,
                    profiletype: payersSelectLists?.profiletype[0]?.$key,
                  }
                  dispatch(
                    payersOperations.getPayerModalInfo(
                      data,
                      false,
                      null,
                      setSelectedPayerFields,
                      true,
                    ),
                  )
                } else {
                  data = { elid: val }
                  dispatch(
                    payersOperations.getPayerEditInfo(
                      data,
                      false,
                      null,
                      setSelectedPayerFields,
                    ),
                  )
                }
              }

              const stripeMethod = paymentsMethodList?.find(e => e?.paymethod?.$ === '57')

              return (
                <Form>
                  <ScrollToFieldError />
                  <div className={s.form}>
                    <div className={s.formBlock}>
                      <div className={cn(s.formFieldsBlock, s.first)}>
                        <div className={s.addPayerBlock}>
                          <div className={s.field_wrapper}>
                            <label className={s.label}>
                              {t('Payment method', { ns: 'other' })}
                            </label>
                            <div className={s.stripeCard}>
                              <img
                                src={`${BASE_URL}${stripeMethod?.image?.$}`}
                                alt="icon"
                              />
                              <div className={s.stripeDescr}>
                                <span>Stripe</span>
                                <span>
                                  {t('Payment amount from 1.00 EUR. ', { ns: 'cart' })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Select
                            placeholder={t('Not chosen', { ns: 'other' })}
                            label={`${t('Payer status', { ns: 'payers' })}:`}
                            value={values.profiletype}
                            getElement={item => setFieldValue('profiletype', item)}
                            isShadow
                            className={s.select}
                            dropdownClass={s.selectDropdownClass}
                            itemsList={payersSelectLists?.profiletype?.map(
                              ({ $key, $ }) => ({
                                label: t(`${$.trim()}`, { ns: 'payers' }),
                                value: $key,
                              }),
                            )}
                          />

                          {values?.profiletype === '3' || values?.profiletype === '2' ? (
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name="name"
                              label={`${t('Company name', { ns: 'payers' })}:`}
                              placeholder={t('Enter data', { ns: 'other' })}
                              isShadow
                              className={s.inputBig}
                              error={!!errors.name}
                              touched={!!touched.name}
                              isRequired
                            />
                          ) : null}

                          {values?.profiletype === '1' && payersList?.length !== 0 && (
                            <Select
                              placeholder={t('Not chosen', { ns: 'other' })}
                              label={`${t('Choose payer', { ns: 'billing' })}:`}
                              value={values.profile}
                              getElement={item => setPayerHandler(item)}
                              isShadow
                              className={s.select}
                              itemsList={[
                                {
                                  name: { $: t('Add new payer', { ns: 'payers' }) },
                                  id: { $: 'new' },
                                },
                                ...payersList,
                              ]?.map(({ name, id }) => ({
                                label: t(`${name?.$?.trim()}`),
                                value: id?.$,
                              }))}
                            />
                          )}

                          <InputField
                            inputWrapperClass={s.inputHeight}
                            name="person"
                            label={
                              values?.profiletype === '1'
                                ? `${t('Full name', { ns: 'other' })}:`
                                : `${t('The contact person', { ns: 'payers' })}:`
                            }
                            placeholder={t('Enter data', { ns: 'other' })}
                            isShadow
                            className={s.inputBig}
                            error={!!errors.person}
                            touched={!!touched.person}
                            isRequired
                          />

                          <SelectGeo
                            setSelectFieldValue={item => setFieldValue('country', item)}
                            selectValue={values.country}
                            selectClassName={s.select}
                            countrySelectClassName={s.countrySelectItem}
                          />

                          <InputField
                            inputWrapperClass={s.inputHeight}
                            name="city_physical"
                            label={`${t('City', { ns: 'other' })}:`}
                            placeholder={t('Enter city', { ns: 'other' })}
                            isShadow
                            className={s.inputBig}
                            error={!!errors.city_physical}
                            touched={!!touched.city_physical}
                            // isRequired
                          />

                          <div className={cn(s.inputBig, s.nsInputBlock)}>
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
                              <div
                                ref={dropdownDescription}
                                className={s.descriptionBlock}
                              >
                                {t('address_format', { ns: 'other' })}
                              </div>
                            </button>
                          </div>

                          {payersSelectedFields?.eu_vat_field ? (
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name="eu_vat"
                              label={`${t('EU VAT-number')}:`}
                              placeholder={t('Enter data', { ns: 'other' })}
                              isShadow
                              className={s.inputBig}
                              error={!!errors.eu_vat}
                              touched={!!touched.eu_vat}
                            />
                          ) : null}
                          {selectedPayerFields?.offer_link && (
                            <div className={s.offerBlock}>
                              <CheckBox
                                initialState={values['offer_3'] || false}
                                setValue={item => setFieldValue('offer_3', item)}
                                className={s.checkbox}
                                error={!!errors['offer_3']}
                                touched={!!touched['offer_3']}
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
                          <div className={s.warn}>
                            <span>{t('click_finish_btn')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={s.btnBlock}>
                    <Button
                      className={s.saveBtn}
                      isShadow
                      size="medium"
                      label={t('FINISH')}
                      type="submit"
                    />
                    <button
                      onClick={() => setCreatePaymentModal(false)}
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
      )}
    </div>
  )
}
