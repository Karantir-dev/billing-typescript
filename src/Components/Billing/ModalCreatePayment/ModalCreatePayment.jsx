import { useEffect, useLayoutEffect, useReducer } from 'react'
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
  Modal,
  Icon,
  CustomPhoneInput,
  TooltipWrapper,
  PayersList,
} from '@components'
import {
  billingOperations,
  settingsOperations,
  billingSelectors,
  payersSelectors,
  authSelectors,
  settingsSelectors,
  cartOperations,
  userSelectors,
  billingActions,
} from '@redux'
import { OFERTA_URL, PRIVACY_URL } from '@config/config'
import * as Yup from 'yup'
import { checkIfTokenAlive, replaceAllFn } from '@utils'
import { QIWI_PHONE_COUNTRIES, SBER_PHONE_COUNTRIES, OFFER_FIELD } from '@utils/constants'

import s from './ModalCreatePayment.module.scss'

export default function ModalCreatePayment() {
  const dispatch = useDispatch()

  const { t } = useTranslation([
    'billing',
    'other',
    'payers',
    'cart',
    'domains',
    'user_settings',
  ])

  const [state, setState] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  const paymentData = useSelector(billingSelectors.getPaymentData)
  const payersList = useSelector(payersSelectors.getPayersList)

  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersData = useSelector(payersSelectors.getPayersData)

  const geoData = useSelector(authSelectors.getGeoData)

  const paymentsMethodList = useSelector(billingSelectors.getPaymentsMethodList)
  const paymentsCurrency = useSelector(billingSelectors.getPaymentsCurrencyList)

  const userEdit = useSelector(settingsSelectors.getUserEdit)
  const userInfo = useSelector(userSelectors.getUserInfo)

  const filteredPayment_method = state.additionalPayMethodts?.find(
    e => e?.$key === state.selectedAddPaymentMethod,
  )

  useLayoutEffect(() => {
    dispatch(billingActions.setIsModalCreatePaymentOpened(true))

    return () => {
      dispatch(billingActions.setPaymentData(null))
      closeModalHandler()
    }
  }, [])

  useEffect(() => {
    dispatch(settingsOperations.getUserEdit(userInfo.$id))
    dispatch(billingOperations.getPaymentMethod())
  }, [])

  useEffect(() => {
    if (state.additionalPayMethodts && state.additionalPayMethodts?.length > 0) {
      setState({ selectedAddPaymentMethod: state.additionalPayMethodts[0]?.$key })
    }
  }, [state.additionalPayMethodts])

  useEffect(() => {
    if (userEdit) {
      const findCountry = userEdit?.phone_countries?.find(
        e => e?.$key === userEdit?.phone_country,
      )
      const code = findCountry?.$image?.slice(-6, -4)?.toLowerCase()
      setState({ userCountryCode: code })
    }
  }, [userEdit])

  const closeModalHandler = () =>
    dispatch(billingActions.setIsModalCreatePaymentOpened(false))

  const createPaymentMethodHandler = values => {
    const data = {
      postcode_physical: values?.postcode_physical,
      eu_vat: values?.eu_vat,
      cnp: values?.cnp,
      city_legal: values?.city_physical,
      city_physical: values?.city_physical,
      address_legal: values?.address_physical,
      address_physical: values?.address_physical,
      postcode: values?.postcode_physical,
      city: values?.city_physical,
      address: values?.address_physical,
      country_physical:
        payersData.selectedPayerFields?.country ||
        payersData.selectedPayerFields?.country_physical ||
        payersSelectedFields?.country ||
        payersSelectedFields?.country_physical ||
        '',
      country_legal:
        payersData.selectedPayerFields?.country ||
        payersData.selectedPayerFields?.country_physical ||
        payersSelectedFields?.country ||
        payersSelectedFields?.country_physical ||
        '',
      profile: values?.profile,
      amount: values?.amount,
      payment_currency: values?.payment_currency?.value,
      paymethod: values?.selectedPayMethod?.paymethod?.$,
      paymethod_name: values?.selectedPayMethod?.name?.$,
      country:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      profiletype: values?.profiletype || '',
      person:
        (payersList && payersList.find(e => e?.id?.$ === values?.profile)?.name?.$) ||
        values?.person ||
        ' ',
      director:
        (payersList && payersList.find(e => e?.id?.$ === values?.profile)?.name?.$) ||
        values?.person ||
        ' ',
      name: '',
      [OFFER_FIELD]: values[OFFER_FIELD] ? 'on' : 'off',
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
      data.jobtitle = payersData.selectedPayerFields?.jobtitle || 'jobtitle '
      data.rdirector = payersData.selectedPayerFields?.rdirector || 'rdirector '
      data.rjobtitle = payersData.selectedPayerFields?.rjobtitle || 'rjobtitle '
      data.ddirector = payersData.selectedPayerFields?.ddirector || 'ddirector '
      data.djobtitle = payersData.selectedPayerFields?.djobtitle || 'djobtitle '
      data.baseaction = payersData.selectedPayerFields?.baseaction || 'baseaction '
      data.name = values?.name || ''
    }

    if (paymentData) {
      data.billorder = paymentData.billorder.$
      data.payment_id = paymentData.payment_id.$
    }

    /** ------- Analytics ------- */
    if (!values?.profile) {
      // Facebook pixel event
      if (window.fbq) window.fbq('track', 'AddPaymentInfo')
      // Quora pixel event
      if (window.qp) window.qp('track', 'AddPaymentInfo')
      // GTM
      window.dataLayer?.push({ event: 'AddPaymentInfo' })
    }

    if (window.qp) window.qp('track', 'InitiateCheckout')
    /** ------- /Analytics ------- */

    dispatch(billingOperations.createPaymentMethod(data, closeModalHandler))
  }

  const validationSchema = Yup.object().shape({
    profile: payersList?.length !== 0 ? Yup.string().required(t('Choose payer')) : null,
    amount: Yup.number().when('selectedPayMethod', {
      is: value => !!value,
      then: Yup.number()
        .positive(`${t('The amount must be greater than')} ${state.minAmount} EUR`)
        .min(
          state.minAmount,
          `${t('The amount must be greater than')} ${state.minAmount} EUR`,
        )
        .max(
          state.maxAmount > 0 ? state.maxAmount : null,
          state.maxAmount > 0
            ? `${t('The amount must be less than')} ${state.maxAmount} EUR`
            : null,
        )
        .required(t('Enter amount')),
    }),

    selectedPayMethod: Yup.object().required(t('Select a Payment Method')),
    payment_method:
      state.additionalPayMethodts && state.additionalPayMethodts?.length > 0
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
    phone:
      !filteredPayment_method?.hide?.includes('phone') &&
      filteredPayment_method?.hide?.includes('alfabank_login')
        ? Yup.string()
            .phone(
              state.countryCode,
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
    [OFFER_FIELD]: Yup.bool().oneOf([true]),
  })

  const renderPayersListTitle = () => (
    <div className={cn(s.formBlockTitle, s.formBlockTitlePayers)}>
      2. {t('Payers choice')}
    </div>
  )

  return (
    <div className={s.modalBg}>
      <Modal
        closeModal={closeModalHandler}
        isOpen
        className={cn(s.modal, {
          [s.visible]: payersSelectedFields && !!payersData.selectedPayerFields,
        })}
      >
        <Modal.Header>
          <span className={s.headerText}>
            {paymentData
              ? `${t('Payment', { ns: 'cart' })} #${paymentData.payment_id.$}`
              : t('Replenishment')}
          </span>
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
                payersData.selectedPayerFields?.profile ||
                payersList?.[payersList?.length - 1]?.id?.$ ||
                '',
              amount: paymentData?.amount.$ || state.amount || '',
              selectedPayMethod: state.selectedPayMethod || undefined,
              name: payersData.state?.name || payersData.selectedPayerFields?.name || '',
              address_physical:
                payersData.state?.addressPhysical ??
                payersData.selectedPayerFields?.address_physical ??
                '',
              city_physical:
                payersData.state?.cityPhysical ??
                (payersData.selectedPayerFields?.city_physical ||
                  geoData?.clients_city ||
                  ''),
              person:
                payersData.state?.person ?? payersData.selectedPayerFields?.person ?? '',
              country:
                payersSelectedFields?.country ||
                payersSelectedFields?.country_physical ||
                '',
              profiletype:
                payersData.state?.profiletype ||
                payersData.selectedPayerFields?.profiletype ||
                payersSelectedFields?.profiletype,
              eu_vat:
                payersData.state?.euVat || payersData.selectedPayerFields?.eu_vat || '',
              cnp: payersData.state?.cnp || payersData.selectedPayerFields?.cnp || '',
              [OFFER_FIELD]: state.isPolicyChecked || false,
              payment_currency: {
                title: paymentsCurrency?.payment_currency_list?.filter(
                  e => e?.$key === paymentsCurrency?.payment_currency,
                )[0]?.$,
                value: paymentsCurrency?.payment_currency,
              },
              phone: state.phone || '',
              payment_method: state.selectedAddPaymentMethod || undefined,
              alfabank_login: state.alfaLogin || '',
            }}
            onSubmit={createPaymentMethodHandler}
          >
            {({ values, setFieldValue, touched, errors, handleBlur }) => {
              const parsePaymentInfo = text => {
                const splittedText = text?.replace(/&nbsp;/g, '').split('<p>')
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

                  const element = document.querySelector(`[name='${fieldErrorNames[0]}']`)
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
                values?.selectedPayMethod &&
                parsePaymentInfo(values?.selectedPayMethod?.desc?.$)

              const readMore = parsedText?.infoText
                ? parsedText?.minAmount?.length + parsedText?.infoText?.length > 140
                : parsedText?.minAmount?.length > 150

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
                const country = list.find(el => el === state.userCountryCode) || list[0]
                setState({ phone: '', countryCode: country })
              }

              const setAdditionalPayMethodts = value =>
                setState({ additionalPayMethodts: value })

              return (
                <Form id="payment">
                  <ScrollToFieldError />
                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>1. {t('Payment method')}</div>
                    <div className={s.formFieldsBlock} name="selectedPayMethod">
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
                              setFieldValue('selectedPayMethod', method)
                              setState({
                                selectedPayMethod: method,
                                selectedAddPaymentMethod: undefined,
                                minAmount: Number(payment_minamount?.$),
                                maxAmount: Number(payment_maxamount?.$),
                              })

                              if (paymethod?.$ === '90') {
                                setCode(QIWI_PHONE_COUNTRIES)
                              } else if (paymethod?.$ === '86') {
                                setCode(SBER_PHONE_COUNTRIES)
                              } else if (paymethod?.$ === '87') {
                                setState({
                                  phone: '',
                                  countryCode: state.userCountryCode,
                                })
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
                                  values?.selectedPayMethod?.paymethod?.$,
                              },
                              { [s.withHint]: paymethod?.$ === '71' },
                            )}
                            key={paymethod?.$}
                          >
                            <div className={s.descrWrapper}>
                              <img
                                src={`${process.env.REACT_APP_BASE_URL}${image?.$}`}
                                alt="icon"
                              />
                              <span
                                className={cn({
                                  [s.methodDescr]: paymethod?.$ === '71',
                                })}
                              >
                                {name?.$}
                              </span>
                            </div>

                            {paymethod?.$ === '71' && (
                              <TooltipWrapper
                                content={t(method?.name.$, { ns: 'other' })}
                                wrapperClassName={cn(s.infoBtnCard)}
                                place="bottom"
                                id={'bank_cards'}
                              >
                                <Icon name="Info" />
                              </TooltipWrapper>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    <div className={s.additionalPayMethodBlock}>
                      {state.additionalPayMethodts &&
                        state.additionalPayMethodts?.length > 1 && (
                          <Select
                            placeholder={t('Not chosen', { ns: 'other' })}
                            label={`${t('Payment method')} Yookasa:`}
                            value={values.payment_method}
                            getElement={item => {
                              setFieldValue('payment_method', item)
                              setState({ selectedAddPaymentMethod: item })
                            }}
                            isShadow
                            className={cn(s.select, s.additionalSelectPayMentMethod)}
                            dropdownClass={s.selectDropdownClass}
                            itemsList={state.additionalPayMethodts?.map(
                              ({ $key, $ }) => ({
                                label: t(`${$.trim()}`, { ns: 'billing' }),
                                value: $key,
                              }),
                            )}
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
                            onChange={e => setState({ alfaLogin: e.target.value })}
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
                              setState({ phone: value })
                            }}
                            name="phone"
                            onlyCountries={renderPhoneList(filteredPayment_method?.$key)}
                            isRequired
                            setCountryCode={value => setState({ countryCode: value })}
                            country={state.countryCode}
                          />
                        )}
                    </div>
                    <ErrorMessage
                      className={s.error_message}
                      name={'selectedPayMethod'}
                      component="span"
                    />
                  </div>

                  <div className={s.formBlock}>
                    <PayersList renderTitle={renderPayersListTitle} />
                  </div>

                  <div
                    className={cn(s.formBlock, s.last, {
                      [s.border]:
                        values?.selectedPayMethod &&
                        (parsedText?.minAmount || parsedText?.infoText),
                    })}
                  >
                    <div className={s.formBlockTitle}>3. {t('Top-up amount')}</div>
                    <div className={s.formFieldsBlock}>
                      <div className={s.inputAmountBlock}>
                        {paymentData ? (
                          <div className={s.priceBlock}>
                            {t('Total', { ns: 'cart' })} :{' '}
                            <b>{paymentData.amount.$} EUR</b>
                          </div>
                        ) : (
                          <>
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name="amount"
                              placeholder={'0.00'}
                              isShadow
                              value={values.amount}
                              onChange={e => {
                                const amount = e?.target?.value.replace(/[^0-9.]/g, '')
                                setFieldValue('amount', amount)
                                setState({
                                  amount,
                                })
                              }}
                              className={s.input}
                              error={!!errors.amount}
                              touched={!!touched.amount}
                              isRequired
                              disabled={!!paymentData}
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
                          </>
                        )}
                      </div>
                    </div>
                    <div className={s.offerBlock}>
                      <CheckBox
                        name={OFFER_FIELD}
                        value={values[OFFER_FIELD]}
                        className={s.checkbox}
                        error={!!errors[OFFER_FIELD]}
                        touched={!!touched[OFFER_FIELD]}
                        onClick={() =>
                          setState({ isPolicyChecked: !state.isPolicyChecked })
                        }
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

                  <div className={cn(s.infotext, { [s.showMore]: state.showMore })}>
                    {values?.selectedPayMethod && (
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
                  {values?.selectedPayMethod && readMore && (
                    <button
                      type="button"
                      onClick={() => setState({ showMore: !state.showMore })}
                      className={s.readMore}
                    >
                      {t(state.showMore ? 'Collapse' : 'Read more')}
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
    </div>
  )
}
