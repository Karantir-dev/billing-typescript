import React, { useEffect, useState, useRef } from 'react'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, ErrorMessage, useFormikContext } from 'formik'
import { Check, Cross, Info } from '../../../images'
import {
  Button,
  Select,
  InputField,
  PaymentCurrencyBtn,
  CheckBox,
  InputWithAutocomplete,
} from '../..'
import {
  billingOperations,
  billingSelectors,
  payersOperations,
  payersSelectors,
  authSelectors,
} from '../../../Redux'
import { BASE_URL } from '../../../config/config'
import * as Yup from 'yup'
import { replaceAllFn } from '../../../utils'

import s from './ModalCreatePayment.module.scss'

export default function Component(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['billing', 'other', 'payers', 'cart'])

  const { setCreatePaymentModal } = props

  const payersList = useSelector(payersSelectors.getPayersList)

  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)

  const geoData = useSelector(authSelectors.getGeoData)

  const paymentsMethodList = useSelector(billingSelectors.getPaymentsMethodList)
  const paymentsCurrency = useSelector(billingSelectors.getPaymentsCurrencyList)

  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)

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

  const offerTextHandler = () => {
    dispatch(payersOperations.getPayerOfferText(selectedPayerFields?.offer_link))
  }

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
      profile: values?.profile === 'new' ? '' : values?.profile,
      amount: values?.amount,
      payment_currency: values?.payment_currency?.value,
      paymethod: values?.slecetedPayMethod?.paymethod?.$,
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
      [selectedPayerFields?.offer_field]: values[selectedPayerFields?.offer_field]
        ? 'on'
        : 'off',
    }

    dispatch(billingOperations.createPaymentMethod(data, setCreatePaymentModal))
  }

  const validationSchema = Yup.object().shape({
    profile: payersList?.length !== 0 ? Yup.string().required(t('Choose payer')) : null,
    amount: Yup.number()
      .positive(`${t('The amount must be greater than')} ${minAmount} EUR`)
      .min(minAmount, `${t('The amount must be greater than')} ${minAmount} EUR`)
      .max(
        maxAmount > 0 ? maxAmount : null,
        maxAmount > 0 ? `${t('The amount must be less than')} ${maxAmount} EUR` : null,
      )
      .required(t('Enter amount')),
    slecetedPayMethod: Yup.object().required(t('Select a Payment Method')),
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
    [selectedPayerFields?.offer_field]: selectedPayerFields?.offer_field
      ? Yup.bool().oneOf([true])
      : null,
  })

  return (
    <div className={s.modalBg}>
      {payersSelectedFields && selectedPayerFields && payersSelectLists && (
        <div className={s.modalBlock}>
          <div className={s.modalHeader}>
            <span className={s.headerText}>{t('Replenishment')}</span>
            <Cross onClick={() => setCreatePaymentModal(false)} className={s.crossIcon} />
          </div>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={{
              profile:
                selectedPayerFields?.profile || payersList[payersList?.length - 1]?.id?.$,
              amount: '',
              slecetedPayMethod: undefined,
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
              [selectedPayerFields?.offer_field]: false,
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
              const parsePaymentInfo = text => {
                const splittedText = text?.split('<p>')
                if (splittedText?.length > 0) {
                  const minAmount = splittedText[0]?.replace('\n', '')

                  let infoText = ''

                  if (splittedText[1] && splittedText?.length > 1) {
                    let replacedText = splittedText[1]
                      ?.replace('<p>', '')
                      ?.replace('</p>', '')
                      ?.replace('<strong>', '')
                      ?.replace('</strong>', '')

                    infoText = replaceAllFn(replacedText, '\n', '')
                  }

                  return { minAmount, infoText }
                }
              }

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

                  // Scroll to first known error into view
                  try {
                    element.scrollIntoView(scrollBehavior)
                  } catch (e) {
                    console.log(e.message)
                  }

                  // Formik doesn't (yet) provide a callback for a client-failed submission,
                  // thus why this is implemented through a hook that listens to changes on
                  // the submit count.
                }, [submitCount])

                return null
              }

              const parsedText =
                values?.slecetedPayMethod &&
                parsePaymentInfo(values?.slecetedPayMethod?.desc?.$)

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

              return (
                <Form>
                  <ScrollToFieldError />
                  <div className={s.form}>
                    <div className={s.formBlock}>
                      <div className={s.formBlockTitle}>1. {t('Payers choice')}</div>
                      <div className={cn(s.formFieldsBlock, s.first)}>
                        <div className={s.addPayerBlock}>
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
                                ...payersList,
                                {
                                  name: { $: t('Add new payer', { ns: 'payers' }) },
                                  id: { $: 'new' },
                                },
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
                            {/* <InputField
                              inputWrapperClass={s.inputHeight}
                              name="address_physical"
                              label={`${t('The address', { ns: 'other' })}:`}
                              placeholder={t('Enter address', { ns: 'other' })}
                              isShadow
                              className={cn(s.inputBig, s.inputAddress)}
                              inputClassName={s.inputAddressWrapp}
                              error={!!errors.address_physical}
                              touched={!!touched.address_physical}
                              isRequired
                            /> */}

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
                                initialState={
                                  values[selectedPayerFields?.offer_field] || false
                                }
                                setValue={item =>
                                  setFieldValue(
                                    `${selectedPayerFields?.offer_field}`,
                                    item,
                                  )
                                }
                                className={s.checkbox}
                                error={!!errors[selectedPayerFields?.offer_field]}
                              />
                              <div className={s.offerBlockText}>
                                {t('I agree with the terms of the offer', {
                                  ns: 'payers',
                                })}
                                <br />
                                <button
                                  onClick={offerTextHandler}
                                  type="button"
                                  className={s.offerBlockLink}
                                >
                                  {selectedPayerFields?.offer_name}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={s.formBlock}>
                      <div className={s.formBlockTitle}>2. {t('Payment method')}</div>
                      <div className={s.formFieldsBlock}>
                        {paymentsMethodList?.map(method => {
                          const {
                            paymethod,
                            image,
                            name,
                            payment_minamount,
                            payment_maxamount,
                          } = method
                          return (
                            <button
                              onClick={() => {
                                setFieldValue('slecetedPayMethod', method)
                                setMinAmount(Number(payment_minamount?.$))
                                setMaxAmount(Number(payment_maxamount?.$))
                              }}
                              type="button"
                              className={cn(s.paymentMethodBtn, {
                                [s.selected]:
                                  paymethod?.$ ===
                                  values?.slecetedPayMethod?.paymethod?.$,
                              })}
                              key={paymethod?.$}
                            >
                              <img src={`${BASE_URL}${image?.$}`} alt="icon" />
                              <span>{name?.$}</span>
                              <Check className={s.iconCheck} />
                            </button>
                          )
                        })}
                      </div>
                      <ErrorMessage
                        className={s.error_message}
                        name={'slecetedPayMethod'}
                        component="span"
                      />
                    </div>
                    <div
                      className={cn(s.formBlock, s.last, {
                        [s.border]:
                          values?.slecetedPayMethod &&
                          (parsedText?.minAmount || parsedText?.infoText),
                      })}
                    >
                      <div className={s.formBlockTitle}>3. {t('Top-up amount')}</div>
                      <div className={s.formFieldsBlock}>
                        <div className={s.inputAmountBlock}>
                          <InputField
                            inputWrapperClass={s.inputHeight}
                            name="amount"
                            placeholder={'0.00'}
                            isShadow
                            value={values.amount}
                            onChange={e =>
                              setFieldValue(
                                'amount',
                                e?.target?.value.replace(/[^0-9.]/g, ''),
                              )
                            }
                            className={s.input}
                            error={!!errors.amount}
                            touched={!!touched.amount}
                            isRequired
                          />
                          {paymentsCurrency && paymentsCurrency?.payment_currency_list && (
                            <PaymentCurrencyBtn
                              list={paymentsCurrency?.payment_currency_list}
                              currentValue={values?.payment_currency?.title}
                              setValue={item => {
                                setFieldValue('payment_currency', item)
                                dispatch(
                                  billingOperations.getPaymentMethod({
                                    payment_currency: item?.value,
                                  }),
                                )
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={s.infotext}>
                      {values?.slecetedPayMethod && (
                        <div>
                          <span>{t(`${parsedText?.minAmount}`, { ns: 'cart' })}</span>
                          {parsedText?.infoText && (
                            <p>{t(`${parsedText?.infoText}`, { ns: 'cart' })}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={s.btnBlock}>
                    <Button
                      disabled={
                        Number(values.amount) <
                        values?.slecetedPayMethod?.payment_minamount?.$
                      }
                      className={s.saveBtn}
                      isShadow
                      size="medium"
                      label={t('Pay')}
                      type="submit"
                    />
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
