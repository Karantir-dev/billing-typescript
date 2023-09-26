import { useEffect, useState, useRef } from 'react'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, ErrorMessage, useFormikContext } from 'formik'
import {
  Button,
  Select,
  InputField,
  PaymentCurrencyBtn,
  CheckBox,
  InputWithAutocomplete,
  SelectGeo,
  Modal,
  Icon,
  CustomPhoneInput,
  HintWrapper,
} from '@components'
import {
  billingOperations,
  settingsOperations,
  billingSelectors,
  payersOperations,
  payersSelectors,
  authSelectors,
  settingsSelectors,
  cartOperations,
  userSelectors,
} from '@redux'
import { BASE_URL, OFERTA_URL, PRIVACY_URL } from '@config/config'
import * as Yup from 'yup'
import { checkIfTokenAlive, replaceAllFn } from '@utils'
import { QIWI_PHONE_COUNTRIES, SBER_PHONE_COUNTRIES } from '@utils/constants'

import s from './ModalCreatePayment.module.scss'

export default function ModalCreatePayment(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation([
    'billing',
    'other',
    'payers',
    'cart',
    'domains',
    'user_settings',
  ])

  const { setCreatePaymentModal } = props

  const payersList = useSelector(payersSelectors.getPayersList)

  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)

  const geoData = useSelector(authSelectors.getGeoData)

  const paymentsMethodList = useSelector(billingSelectors.getPaymentsMethodList)
  const paymentsCurrency = useSelector(billingSelectors.getPaymentsCurrencyList)

  const [amount, setAmount] = useState('')
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [slecetedPayMethod, setSlecetedPayMethod] = useState(undefined)
  const [isPolicyChecked, setIsPolicyChecked] = useState(false)
  const [person, setPerson] = useState(null)
  const [cityPhysical, setCityPhysical] = useState(null)
  const [addressPhysical, setAddressPhysical] = useState(null)
  const [profileType, setProfileType] = useState('')
  const [company, setCompany] = useState('')
  const [euVat, setEUVat] = useState('')
  const [additionalPayMethodts, setAdditionalPayMethodts] = useState(undefined)
  const [selectedAddPaymentMethod, setSelectedAddPaymentMethod] = useState(undefined)

  const dropdownDescription = useRef(null)

  const [selectedPayerFields, setSelectedPayerFields] = useState(null)
  const [payerFieldList, setPayerFieldList] = useState(null)

  const [userCountryCode, setUserCountryCode] = useState(null)
  const [countryCode, setCountryCode] = useState(null)
  const [phone, setPhone] = useState('')
  const [alfaLogin, setAlfaLogin] = useState('')

  const userEdit = useSelector(settingsSelectors.getUserEdit)
  const userInfo = useSelector(userSelectors.getUserInfo)

  const filteredPayment_method = additionalPayMethodts?.find(
    e => e?.$key === selectedAddPaymentMethod,
  )

  useEffect(() => {
    dispatch(billingOperations.getPayers())
    dispatch(settingsOperations.getUserEdit(userInfo.$id))
  }, [])

  useEffect(() => {
    if (additionalPayMethodts && additionalPayMethodts?.length > 0) {
      setSelectedAddPaymentMethod(additionalPayMethodts[0]?.$key)
    }
  }, [additionalPayMethodts])

  useEffect(() => {
    if (userEdit) {
      const findCountry = userEdit?.phone_countries?.find(
        e => e?.$key === userEdit?.phone_country,
      )
      const code = findCountry?.$image?.slice(-6, -4)?.toLowerCase()
      setUserCountryCode(code)
    }
  }, [userEdit])

  useEffect(() => {
    if (payersList && payersSelectLists) {
      let data = {
        country: payersSelectLists?.country[0]?.$key,
        profiletype: payersSelectLists?.profiletype[0]?.$key,
      }
      if (payersList?.length !== 0) {
        data = { elid: payersList[payersList?.length - 1]?.id?.$ }
        dispatch(
          payersOperations.getPayerEditInfo(
            data,
            false,
            null,
            setSelectedPayerFields,
            false,
            setPayerFieldList,
          ),
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

  useEffect(() => {
    if (selectedPayerFields && !selectedPayerFields?.offer_field) {
      setSelectedPayerFields(d => {
        return { ...d, offer_field: 'offer_3' }
      })
    }
  }, [selectedPayerFields])

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
        selectedPayerFields?.country ||
        selectedPayerFields?.country_physical ||
        payersSelectedFields?.country ||
        payersSelectedFields?.country_physical ||
        '',
      country_legal:
        selectedPayerFields?.country ||
        selectedPayerFields?.country_physical ||
        payersSelectedFields?.country ||
        payersSelectedFields?.country_physical ||
        '',
      profile: values?.profile,
      amount: values?.amount,
      payment_currency: values?.payment_currency?.value,
      paymethod: values?.slecetedPayMethod?.paymethod?.$,
      paymethod_name: values?.slecetedPayMethod?.name?.$,
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

    if (values?.payment_method) {
      data['payment_method'] = values?.payment_method
    }

    if (values?.phone && values?.phone?.length > 0) {
      data['phone'] = values?.phone
    }

    if (values?.alfabank_login && values?.alfabank_login?.length > 0) {
      data['alfabank_login'] = values?.alfabank_login
    }

    if (values.profiletype && values.profiletype !== '1') {
      data.jobtitle = selectedPayerFields?.jobtitle || 'jobtitle '
      data.rdirector = selectedPayerFields?.rdirector || 'rdirector '
      data.rjobtitle = selectedPayerFields?.rjobtitle || 'rjobtitle '
      data.ddirector = selectedPayerFields?.ddirector || 'ddirector '
      data.djobtitle = selectedPayerFields?.djobtitle || 'djobtitle '
      data.baseaction = selectedPayerFields?.baseaction || 'baseaction '
    }

    // facebook pixel event
    if (!values?.profile && window.fbq) {
      window.fbq('track', 'AddPaymentInfo')
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
    city_physical: Yup.string().required(t('Is a required field', { ns: 'other' })),
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
    payment_method:
      additionalPayMethodts && additionalPayMethodts?.length > 0
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
    phone:
      !filteredPayment_method?.hide?.includes('phone') &&
      filteredPayment_method?.hide?.includes('alfabank_login')
        ? Yup.string()
            .phone(
              countryCode,
              false,
              t('Must be a valid phone number', { ns: 'user_settings' }),
            )
            .required(t('Is a required field', { ns: 'other' }))
        : null,
    alfabank_login:
      filteredPayment_method?.hide?.includes('phone') &&
      !filteredPayment_method?.hide?.includes('alfabank_login')
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
    [selectedPayerFields?.offer_field]: Yup.bool().oneOf([true]),
  })

  return (
    <div className={s.modalBg}>
      {payersSelectedFields && !!selectedPayerFields && !!payersSelectLists && (
        <Modal closeModal={() => setCreatePaymentModal(false)} isOpen className={s.modal}>
          <Modal.Header>
            <span className={s.headerText}>{t('Replenishment')}</span>
          </Modal.Header>
          <Modal.Body>
            <Formik
              enableReinitialize
              validateOnBlur={false}
              validateOnMount={false}
              validateOnChange={false}
              validationSchema={validationSchema}
              initialValues={{
                profile:
                  selectedPayerFields?.profile ||
                  payersList[payersList?.length - 1]?.id?.$ ||
                  '',
                amount: amount || '',
                slecetedPayMethod: slecetedPayMethod || undefined,
                name: company || selectedPayerFields?.name || '',
                address_physical:
                  addressPhysical ?? selectedPayerFields?.address_physical,
                city_physical:
                  cityPhysical ??
                  (selectedPayerFields?.city_physical || geoData?.clients_city),
                person: person ?? selectedPayerFields?.person,
                country:
                  payersSelectedFields?.country ||
                  payersSelectedFields?.country_physical ||
                  '',
                profiletype:
                  profileType ||
                  selectedPayerFields?.profiletype ||
                  payersSelectedFields?.profiletype,
                eu_vat: euVat || selectedPayerFields?.eu_vat || '',
                [selectedPayerFields?.offer_field]: isPolicyChecked || false,
                payment_currency: {
                  title: paymentsCurrency?.payment_currency_list?.filter(
                    e => e?.$key === paymentsCurrency?.payment_currency,
                  )[0]?.$,
                  value: paymentsCurrency?.payment_currency,
                },
                phone: phone || '',
                payment_method: selectedAddPaymentMethod || undefined,
                alfabank_login: alfaLogin || '',
              }}
              onSubmit={createPaymentMethodHandler}
            >
              {({
                values,
                setFieldValue,
                touched,
                errors,
                handleBlur,
                setFieldTouched,
              }) => {
                const [errorFields, setErrorFields] = useState({})

                useEffect(() => {
                  if (
                    selectedPayerFields?.address_physical &&
                    (!/(?=\d)/.test(selectedPayerFields?.address_physical) ||
                      !/^[^@#$%^&*!~<>]+$/.test(selectedPayerFields?.address_physical))
                  ) {
                    setErrorFields(prev => ({ ...prev, address_physical: true }))
                    setFieldTouched('address_physical', true, true)
                  } else {
                    setErrorFields(prev => ({ ...prev, address_physical: false }))
                  }
                }, [selectedPayerFields])

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
                  const transformObjectToDotNotation = (
                    obj,
                    prefix = '',
                    result = [],
                  ) => {
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

                    const element =
                      document.querySelector(`input[name='${fieldErrorNames[0]}']`) ||
                      document.querySelector(`button[name='${fieldErrorNames[0]}']`)
                    if (!element) return

                    // Scroll to first known error into view
                    try {
                      element.scrollIntoView(scrollBehavior)
                    } catch (e) {
                      checkIfTokenAlive(e?.message, dispatch)
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
                  if (val === values.profile) return

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
                        false,
                        setPayerFieldList,
                      ),
                    )
                  }

                  setPerson(null)
                  setCityPhysical(null)
                  setAddressPhysical(null)
                }

                const readMore = parsedText?.infoText
                  ? parsedText?.minAmount?.length + parsedText?.infoText?.length > 140
                  : parsedText?.minAmount?.length > 150

                const payerTypeArrayHandler = () => {
                  const arr = payerFieldList?.profiletype
                    ? payerFieldList?.profiletype
                    : payersSelectLists?.profiletype

                  return arr?.map(({ $key, $ }) => ({
                    label: t(`${$.trim()}`, { ns: 'payers' }),
                    value: $key,
                  }))
                }

                const onProfileTypeChange = item => {
                  setFieldValue('profiletype', item)
                  setProfileType(item)
                  let data = {
                    country: payersSelectLists?.country[0]?.$key,
                    profiletype: item,
                  }

                  dispatch(payersOperations.getPayerModalInfo(data))
                }

                const renderPhoneList = paymethod => {
                  if (paymethod === 'qiwi') {
                    return QIWI_PHONE_COUNTRIES
                  } else if (paymethod === 'sberbank') {
                    return SBER_PHONE_COUNTRIES
                  } else {
                    return []
                  }
                }

                const setCode = list => {
                  const country = list.find(el => el === userCountryCode) || list[0]
                  setPhone('')
                  setCountryCode(country)
                }

                return (
                  <Form id="payment">
                    <ScrollToFieldError />
                    <div className={s.formBlock}>
                      <div className={s.formBlockTitle}>1. {t('Payment method')}</div>
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
                                setSlecetedPayMethod(method)
                                setSelectedAddPaymentMethod(undefined)
                                setMinAmount(Number(payment_minamount?.$))
                                setMaxAmount(Number(payment_maxamount?.$))
                                if (paymethod?.$ === '90') {
                                  setCode(QIWI_PHONE_COUNTRIES)
                                } else if (paymethod?.$ === '86') {
                                  setCode(SBER_PHONE_COUNTRIES)
                                } else if (paymethod?.$ === '87') {
                                  setPhone('')
                                  setCountryCode(userCountryCode)
                                }
                                dispatch(
                                  cartOperations.getPayMethodItem(
                                    {
                                      paymethod: method?.paymethod?.$,
                                    },
                                    setAdditionalPayMethodts,
                                  ),
                                )
                              }}
                              type="button"
                              className={cn(
                                s.paymentMethodBtn,
                                {
                                  [s.selected]:
                                    paymethod?.$ ===
                                    values?.slecetedPayMethod?.paymethod?.$,
                                },
                                { [s.withHint]: paymethod?.$ === '71' },
                              )}
                              key={paymethod?.$}
                            >
                              <div className={s.descrWrapper}>
                                <img src={`${BASE_URL}${image?.$}`} alt="icon" />
                                <span
                                  className={cn({
                                    [s.methodDescr]: paymethod?.$ === '71',
                                  })}
                                >
                                  {name?.$}
                                </span>
                              </div>

                              {paymethod?.$ === '71' && (
                                <HintWrapper
                                  popupClassName={s.cardHintWrapper}
                                  label={t('Paypalich description', { ns: 'other' })}
                                  wrapperClassName={cn(s.infoBtnCard)}
                                  bottom
                                >
                                  <Icon name="Info" />
                                </HintWrapper>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      <div className={s.additionalPayMethodBlock}>
                        {additionalPayMethodts && additionalPayMethodts?.length > 1 && (
                          <Select
                            placeholder={t('Not chosen', { ns: 'other' })}
                            label={`${t('Payment method')} Yookasa:`}
                            value={values.payment_method}
                            getElement={item => {
                              setFieldValue('payment_method', item)
                              setSelectedAddPaymentMethod(item)
                            }}
                            isShadow
                            className={cn(s.select, s.additionalSelectPayMentMethod)}
                            dropdownClass={s.selectDropdownClass}
                            itemsList={additionalPayMethodts?.map(({ $key, $ }) => ({
                              label: t(`${$.trim()}`, { ns: 'billing' }),
                              value: $key,
                            }))}
                            error={errors.payment_method}
                            isRequired
                          />
                        )}

                        {filteredPayment_method?.hide?.includes('phone') &&
                          !filteredPayment_method?.hide?.includes('alfabank_login') && (
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name="alfabank_login"
                              label={`${t('Имя пользователя в Альфа-Клик', {
                                ns: 'payers',
                              })}:`}
                              placeholder={t('Enter data', { ns: 'other' })}
                              isShadow
                              className={cn(s.inputBig, s.additionalSelectPayMentMethod)}
                              error={!!errors.alfabank_login}
                              touched={!!touched.alfabank_login}
                              isRequired
                              onChange={e => setAlfaLogin(e.target.value)}
                            />
                          )}

                        {!filteredPayment_method?.hide?.includes('phone') &&
                          filteredPayment_method?.hide?.includes('alfabank_login') && (
                            <CustomPhoneInput
                              containerClass={cn(s.inputHeight, 'payModal')}
                              wrapperClass={s.inputBig}
                              inputClass={s.phoneInputClass}
                              value={values.phone}
                              labelClass={s.phoneInputLabel}
                              label={`${t('Phone', { ns: 'other' })}:`}
                              handleBlur={handleBlur}
                              setFieldValue={(name, value) => {
                                setFieldValue(name, value)
                                setPhone(value)
                              }}
                              name="phone"
                              onlyCountries={renderPhoneList(
                                filteredPayment_method?.$key,
                              )}
                              isRequired
                              setCountryCode={setCountryCode}
                              country={countryCode}
                            />
                          )}
                      </div>
                      <ErrorMessage
                        className={s.error_message}
                        name={'slecetedPayMethod'}
                        component="span"
                      />
                    </div>

                    <div className={s.formBlock}>
                      <div className={s.formBlockTitle}>2. {t('Payers choice')}</div>
                      <div className={cn(s.formFieldsBlock, s.first)}>
                        <div className={s.addPayerBlock}>
                          {payerTypeArrayHandler()?.length > 1 && (
                            <Select
                              placeholder={t('Not chosen', { ns: 'other' })}
                              label={`${t('Payer status', { ns: 'payers' })}:`}
                              value={values.profiletype}
                              getElement={onProfileTypeChange}
                              isShadow
                              className={s.select}
                              dropdownClass={s.selectDropdownClass}
                              itemsList={payerTypeArrayHandler()}
                            />
                          )}

                          {(values?.profiletype === '3' || values?.profiletype === '2') &&
                          !selectedPayerFields.name ? (
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
                              value={values.name}
                              onChange={e => setCompany(e.target.value)}
                            />
                          ) : null}

                          {payersList?.length !== 0 && (
                            <Select
                              placeholder={t('Not chosen', { ns: 'other' })}
                              label={`${t('Choose payer', { ns: 'billing' })}:`}
                              value={values.profile}
                              getElement={item => setPayerHandler(item)}
                              isShadow
                              className={s.select}
                              itemsList={[...payersList]?.map(({ name, id }) => ({
                                label: t(`${name?.$?.trim()}`),
                                value: id?.$,
                              }))}
                              disabled={payersList.length === 1}
                              withoutArrow={payersList.length === 1}
                            />
                          )}

                          {!selectedPayerFields.person && (
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
                              value={values.person}
                              onChange={e => setPerson(e.target.value)}
                            />
                          )}

                          {!selectedPayerFields.person && (
                            <SelectGeo
                              setSelectFieldValue={item => setFieldValue('country', item)}
                              selectValue={values.country}
                              selectClassName={s.select}
                              countrySelectClassName={s.countrySelectItem}
                              geoData={geoData}
                              payersSelectLists={payersSelectLists}
                            />
                          )}

                          {!selectedPayerFields.city_physical && (
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name="city_physical"
                              label={`${t('City', { ns: 'other' })}:`}
                              placeholder={t('Enter city', { ns: 'other' })}
                              isShadow
                              className={s.inputBig}
                              error={!!errors.city_physical}
                              touched={!!touched.city_physical}
                              value={values.city_physical}
                              onChange={e => setCityPhysical(e.target.value)}
                            />
                          )}

                          {(!selectedPayerFields.address_physical ||
                            errorFields.address_physical) && (
                            <div className={cn(s.inputBig, s.nsInputBlock)}>
                              <InputWithAutocomplete
                                fieldName="address_physical"
                                error={!!errors.address_physical}
                                touched={!!touched.address_physical}
                                externalValue={values.address_physical}
                                setFieldValue={val => {
                                  setFieldValue('address_physical', val)
                                  setAddressPhysical(val)
                                }}
                              />

                              <button type="button" className={s.infoBtn}>
                                <Icon name="Info" />
                                <div
                                  ref={dropdownDescription}
                                  className={s.descriptionBlock}
                                >
                                  {t('address_format', { ns: 'other' })}
                                </div>
                              </button>
                            </div>
                          )}

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
                              value={values.eu_vat}
                              onChange={e => setEUVat(e.target.value)}
                            />
                          ) : null}
                        </div>
                      </div>
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
                            onChange={e => {
                              setFieldValue(
                                'amount',
                                e?.target?.value.replace(/[^0-9.]/g, ''),
                              )
                              setAmount(e?.target?.value.replace(/[^0-9.]/g, ''))
                            }}
                            className={s.input}
                            error={!!errors.amount}
                            touched={!!touched.amount}
                            isRequired
                          />
                          {paymentsCurrency &&
                            paymentsCurrency?.payment_currency_list && (
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
                      <div className={s.offerBlock}>
                        <CheckBox
                          name={selectedPayerFields?.offer_field}
                          value={values[selectedPayerFields?.offer_field]}
                          className={s.checkbox}
                          error={!!errors[selectedPayerFields?.offer_field]}
                          touched={!!touched[selectedPayerFields?.offer_field]}
                          onClick={() => setIsPolicyChecked(prev => !prev)}
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
                    </div>

                    <div className={cn(s.infotext, { [s.showMore]: showMore })}>
                      {values?.slecetedPayMethod && (
                        <div>
                          <span>
                            {t(`${parsedText?.minAmount?.trim()}`, { ns: 'cart' })}
                          </span>
                          {parsedText?.infoText && (
                            <p>{t(`${parsedText?.infoText?.trim()}`, { ns: 'cart' })}</p>
                          )}
                        </div>
                      )}
                    </div>
                    {values?.slecetedPayMethod && readMore && (
                      <button
                        type="button"
                        onClick={() => setShowMore(!showMore)}
                        className={s.readMore}
                      >
                        {t(showMore ? 'Collapse' : 'Read more')}
                      </button>
                    )}
                  </Form>
                )
              }}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={s.saveBtn}
              isShadow
              size="medium"
              label={t('Pay')}
              type="submit"
              form="payment"
            />
          </Modal.Footer>
        </Modal>
      )}
    </div>
  )
}
