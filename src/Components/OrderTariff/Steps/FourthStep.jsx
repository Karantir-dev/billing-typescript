import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorMessage, Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import s from '../OrderTariff.module.scss'
import cn from 'classnames'
import { QIWI_PHONE_COUNTRIES, SBER_PHONE_COUNTRIES, OFFER_FIELD } from '@utils/constants'
import {
  cartActions,
  cartOperations,
  payersSelectors,
  selectors,
  settingsOperations,
  settingsSelectors,
  userOperations,
  userSelectors,
} from '@redux'
import {
  CheckBox,
  CustomPhoneInput,
  TooltipWrapper,
  Icon,
  InputField,
  Select,
} from '@components'
import {
  roundToDecimal,
  useFormFraudCheckData,
  sortPaymethodList,
  parsePaymentInfo,
} from '@utils'
import { PRIVACY_URL, OFERTA_URL } from '@config/config'
import * as Yup from 'yup'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'

export default function FourthStep({
  state,
  setState,
  parameters,
  service,
  id,
  count,
  isFree,
  setIsFree,
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const dropdownSale = useRef(null)

  const { t } = useTranslation([
    'cart',
    'other',
    'payers',
    'billing',
    'user_settings',
    'domains',
  ])

  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersData = useSelector(payersSelectors.getPayersData)
  const promotionsList = useSelector(selectors.getPromotionsList)

  const filteredPayment_method = state.additionalPayMethodts?.find(
    e => e?.$key === state.selectedAddPaymentMethod,
  )

  const userEdit = useSelector(settingsSelectors.getUserEdit)
  const userInfo = useSelector(userSelectors.getUserInfo)

  const paymentListhandler = data => {
    const sortedList = sortPaymethodList(data)

    setState({
      paymentListLoaded: true,
      paymentsMethodList: sortedList,
      selectedPayMethod: state.selectedPayMethod || sortedList?.[0],
    })
  }

  const setCartData = value => setState({ cartData: value })

  const openPayStepHandler = () => {
    const { register, ostempl, recipe, domain, server_name } = parameters

    const params = {
      service,
      period: parameters.order_period.$,
      id,
      ostempl: ostempl?.$,
      recipe: recipe?.$,
      autoprolong: parameters.autoprolong?.$ === 'on' ? parameters.order_period.$ : 'off',
      order_count: count,
      domain: domain?.$ || '',
      server_name: server_name?.$ || '',
    }

    for (const key in register) {
      params[register[key]] = parameters[key]
    }

    dispatch(
      userOperations.cleanBsketHandler(() =>
        dispatch(cartOperations.setOrderData(params, getBasketInfo)),
      ),
    )
  }

  const getBasketInfo = () => {
    dispatch(cartOperations.getBasket(setCartData, paymentListhandler, false))
    dispatch(cartOperations.getSalesList())
    dispatch(settingsOperations.getUserEdit(userInfo.$id))
  }

  useEffect(() => {
    openPayStepHandler()

    return () => setState({ cartData: null })
  }, [])

  useEffect(() => {
    if (state.additionalPayMethodts && state.additionalPayMethodts?.length > 0) {
      setState({
        selectedAddPaymentMethod:
          state.selectedAddPaymentMethod || state.additionalPayMethodts[0]?.$key,
      })
    }
  }, [state.additionalPayMethodts])

  useEffect(() => {
    if (state.cartData && !state.isPhoneVerification) {
      state.cartData?.elemList?.forEach(e => {
        if (e?.needphoneverify?.$ === 'on') {
          setState({ isPhoneVerification: true })
        }
      })
    }
  }, [state.cartData])

  useEffect(() => {
    if (userEdit) {
      const findCountry = userEdit?.phone_countries?.find(
        e => e?.$key === userEdit?.phone_country,
      )
      const code = findCountry?.$image?.slice(-6, -4)?.toLowerCase()
      setState({ userCountryCode: code })
    }
  }, [userEdit])

  const validationSchema = Yup.object().shape({
    payment_method:
      state.additionalPayMethodts && state.additionalPayMethodts?.length > 0
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
    selectedPayMethod: Yup.object().required(t('Is a required field', { ns: 'other' })),
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

  const setPromocodeToCart = promocode => {
    dispatch(
      cartOperations.setBasketPromocode(promocode, setCartData, paymentListhandler),
    )
  }

  const fraudData = useFormFraudCheckData()

  const payBasketHandler = values => {
    const data = {
      postcode_physical: payersData?.selectedPayerFields?.postcode_physical,
      eu_vat: payersData?.selectedPayerFields?.eu_vat,
      cnp: payersData?.selectedPayerFields?.cnp || payersSelectedFields?.cnp || '',
      city_legal: payersData?.selectedPayerFields?.city_physical,
      city_physical: payersData?.selectedPayerFields?.city_physical,
      address_legal: payersData?.selectedPayerFields?.address_physical,
      address_physical: payersData?.selectedPayerFields?.address_physical,
      postcode: payersData?.selectedPayerFields?.postcode_physical,
      city: payersData?.selectedPayerFields?.city_physical,
      address: payersData?.selectedPayerFields?.address_physical,
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
      billorder: state.cartData?.billorder,
      amount: state.cartData?.total_sum,
      profile: payersData?.selectedPayerFields?.profile,
      paymethod: values?.selectedPayMethod?.paymethod?.$,
      country:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      profiletype: payersData?.selectedPayerFields?.profiletype || '',
      person: payersData?.selectedPayerFields.person || ' ',
      director: payersData?.selectedPayerFields.director || ' ',
      promocode: values?.promocode || '',
      [OFFER_FIELD]: values[OFFER_FIELD] ? 'on' : 'off',
    }

    if (values?.selectedPayMethod?.action?.button?.$name === 'fromsubaccount') {
      data['clicked_button'] = 'fromsubaccount'
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

    // facebook pixel event
    if (!values?.profile && window.fbq) {
      window.fbq('track', 'AddPaymentInfo')
    }

    if (
      payersData.selectedPayerFields.profiletype &&
      payersData.selectedPayerFields.profiletype !== '1'
    ) {
      data.jobtitle = payersData.selectedPayerFields?.jobtitle || 'jobtitle '
      data.rdirector = payersData.selectedPayerFields?.rdirector || 'rdirector '
      data.rjobtitle = payersData.selectedPayerFields?.rjobtitle || 'rjobtitle '
      data.ddirector = payersData.selectedPayerFields?.ddirector || 'ddirector '
      data.djobtitle = payersData.selectedPayerFields?.djobtitle || 'djobtitle '
      data.baseaction = payersData.selectedPayerFields?.baseaction || 'baseaction '
      data.name = payersData.selectedPayerFields?.name || ''
    }

    const cart = { ...state.cartData, paymethod_name: values?.selectedPayMethod?.name?.$ }

    if (cart.paymethod_name.includes('Account balance')) {
      dispatch(
        cartActions.setCartIsOpenedState({
          redirectPath: route.SERVICES,
        }),
      )
    }

    dispatch(cartOperations.setPaymentMethods(data, navigate, cart, fraudData))
  }

  const renderActiveDiscounts = () => {
    const arr = state.cartData?.elemList[0]?.price_hint?.$?.split('<br/>')

    const services = arr?.filter(
      e =>
        !e?.includes('Active discounts') &&
        !e?.includes('Total discount') &&
        e?.length > 0,
    )

    const total = arr
      ?.find(e => e?.includes('Total discount'))
      ?.replace('Total discount ~', '')

    return (
      <div>
        <b>{t('Active discounts')}</b>
        <br />
        <br />
        {services?.map(e => {
          function getString(str) {
            let result = str?.match(/(-?\d+(\.\d+)?%)/g)
            return result.at(0) === '0%' ? [] : result
          }
          if (getString(e)?.length !== 0) {
            return (
              <p
                key={e}
                className={s.discItem}
                dangerouslySetInnerHTML={{
                  __html: e
                    ?.replace(' -', ':')
                    ?.replace(
                      getString(e)[0],
                      `<span style='color: #FA6848'>-${getString(e)[0]}</span>`,
                    ),
                }}
              />
            )
          }
        })}
        <br />
        <div className={s.actLine} />
        <br />
        {t('Total discounts')}: ≈ {total}
      </div>
    )
  }

  /**
   * In this useEffect we check for the dedic half year promotion
   * if this promotion for dedic is enabled and it is dedic ordering -
   * we disable promocode field
   */
  useEffect(() => {
    const isItDedic =
      state.cartData?.elemList?.[0]?.pricelist_name.$.toLowerCase().includes('config')

    if (isItDedic) {
      const cartConfigName = state.cartData?.elemList[0]?.pricelist_name.$?.slice(
        0,
        state.cartData?.elemList[0]?.pricelist_name.$.indexOf('/') - 1,
      )

      let foundSale
      /**
       * This if statement is for two versions of API
       * This first block is for a new version
       */
      if (promotionsList?.[0]?.products) {
        foundSale = promotionsList.find(sale => sale.products.$.includes(cartConfigName))

        /**
         * and this second block is for an old version,
         * which should be removed after API updating
         */
      } else {
        foundSale = promotionsList.find(
          sale =>
            sale.promotion?.$ === 'Большие скидки на выделенные серверы' &&
            sale.idname.$.includes(cartConfigName),
        )
      }

      const cartDiscountPercent =
        state.cartData?.elemList[0]?.discount_percent?.$.replace('%', '') || 0
      const selectedPeriod = state.cartData?.elemList[0]?.['item.period']?.$

      if (foundSale) {
        if (
          (selectedPeriod === '12' && Number(cartDiscountPercent) <= 8) ||
          (selectedPeriod === '24' && Number(cartDiscountPercent) <= 10) ||
          (selectedPeriod === '36' && Number(cartDiscountPercent) <= 12) ||
          cartDiscountPercent === 0
        ) {
          setState({ isDedicWithSale: false })
        } else {
          setState({ isDedicWithSale: true })
        }
      }
    }
  }, [promotionsList, state.cartData?.elemList])

  const setCode = list => {
    const country = list.find(el => el === state.userCountryCode) || list[0]
    setState({ phone: '', countryCode: country })
  }

  const setAdditionalPayMethodts = value => setState({ additionalPayMethodts: value })

  useEffect(() => {
    dispatch(
      cartOperations.getPayMethodItem(
        {
          paymethod:
            state.selectedPayMethod?.paymethod?.$ ||
            state.paymentsMethodList?.[0]?.paymethod?.$,
        },
        setAdditionalPayMethodts,
      ),
    )
  }, [state.paymentsMethodList])

  const renderPhoneList = paymethod => {
    if (paymethod === 'qiwi') {
      return QIWI_PHONE_COUNTRIES
    } else if (paymethod === 'sberbank') {
      return SBER_PHONE_COUNTRIES
    } else {
      return []
    }
  }

  return (
    <>
      <p className={s.section_title}>{t('Select a Payment Method', { ns: 'billing' })}</p>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          selectedPayMethod: state.selectedPayMethod || state.paymentsMethodList?.[0],
          promocode: state.promocode,
          isPersonalBalance:
            state.selectedPayMethod?.name?.$?.includes('balance') &&
            state.selectedPayMethod?.paymethod_type?.$ === '0'
              ? 'on'
              : 'off',
          phone: state.phone || '',
          payment_method: state.selectedAddPaymentMethod || undefined,
          alfabank_login: state.alfaLogin || '',
          [OFFER_FIELD]: state.isPolicyChecked || false,
        }}
        onSubmit={payBasketHandler}
      >
        {({ values, setFieldValue, errors, touched, handleBlur }) => {
          useEffect(() => {
            if (Number(state.cartData?.total_sum) === 0 && state.paymentsMethodList) {
              setIsFree(true)
              const balancePaymethod = state.paymentsMethodList.find(el =>
                el.name?.$.includes('Account balance'),
              )

              setFieldValue('selectedPayMethod', balancePaymethod)
              setFieldValue('isPersonalBalance', 'on')
              setState({
                selectedPayMethod: balancePaymethod,
                selectedAddPaymentMethod: undefined,
              })
            }
          }, [state.cartData?.total_sum, state.paymentsMethodList])

          const parsedText =
            values?.selectedPayMethod &&
            parsePaymentInfo(values?.selectedPayMethod?.desc?.$)

          const readMore = parsedText?.infoText
            ? parsedText?.minAmount?.length + parsedText?.infoText?.length > 140
            : parsedText?.minAmount?.length > 150
          return (
            <Form id="pay">
              {!isFree && (
                <>
                  <div className={cn(s.formBlock)}>
                    {state.paymentsMethodList?.length > 0 &&
                      !state.isPhoneVerification && (
                        <>
                          <div className={s.formFieldsBlock} name="selectedPayMethod´">
                            {state.paymentsMethodList?.map(method => {
                              const { image, name, paymethod_type, paymethod } = method

                              let paymentName = name?.$
                              let balance = ''

                              if (paymentName?.includes('Account balance')) {
                                balance = paymentName?.match(/[-\d|.|\\+]+/g)
                                paymentName = t('Account balance')
                              }

                              return (
                                <button
                                  onClick={() => {
                                    setFieldValue('selectedPayMethod', method)

                                    setState({
                                      selectedPayMethod: method,
                                      selectedAddPaymentMethod: undefined,
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

                                    if (
                                      method?.name?.$?.includes('balance') &&
                                      method?.paymethod_type?.$ === '0'
                                    ) {
                                      setFieldValue('isPersonalBalance', 'on')
                                    } else {
                                      dispatch(
                                        cartOperations.getPayMethodItem(
                                          {
                                            paymethod: method?.paymethod?.$,
                                          },
                                          setAdditionalPayMethodts,
                                        ),
                                      )
                                      setFieldValue('isPersonalBalance', 'off')
                                    }
                                  }}
                                  type="button"
                                  className={cn(
                                    s.paymentMethodBtn,
                                    {
                                      [s.selected]:
                                        paymethod_type?.$ ===
                                          values?.selectedPayMethod?.paymethod_type?.$ &&
                                        paymethod?.$ ===
                                          values?.selectedPayMethod?.paymethod?.$,
                                    },
                                    { [s.withHint]: paymethod?.$ === '71' },
                                  )}
                                  key={name?.$}
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
                                      {paymentName}
                                      {balance?.length > 0 && (
                                        <>
                                          <br />{' '}
                                          <span className={s.balance}>
                                            {roundToDecimal(Number(balance))} EUR
                                          </span>
                                        </>
                                      )}
                                    </span>
                                  </div>
                                  {paymethod?.$ === '71' && (
                                    <TooltipWrapper
                                      label={t(method?.name.$, {
                                        ns: 'other',
                                      })}
                                      wrapperClassName={cn(s.infoBtnCard)}
                                      place="bottom"
                                    >
                                      <Icon name="Info" />
                                    </TooltipWrapper>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                          <ErrorMessage
                            className={s.error_message}
                            name={'selectedPayMethod'}
                            component="span"
                          />
                        </>
                      )}
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
                            containerClass={cn(s.inputHeight, 'cartModal')}
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
                  </div>

                  {values?.selectedPayMethod &&
                    values?.selectedPayMethod?.payment_minamount && (
                      <div
                        className={cn(s.infotext, {
                          [s.showMore]: state.showMore,
                        })}
                      >
                        <div>
                          <span>
                            {t(`${parsedText?.minAmount?.trim()}`, { ns: 'cart' })}{' '}
                            {parsedText?.commission && (
                              <strong>
                                {t(`Commission ${parsedText?.commission}`, {
                                  ns: 'cart',
                                })}
                              </strong>
                            )}
                          </span>
                          {parsedText?.infoText && (
                            <p>{t(`${parsedText?.infoText?.trim()}`, { ns: 'cart' })}</p>
                          )}
                        </div>
                      </div>
                    )}
                  {values?.selectedPayMethod && readMore && (
                    <button
                      type="button"
                      onClick={() => setState({ showMore: !state.showMore })}
                      className={cn(s.readMore)}
                    >
                      {t(state.showMore ? 'Collapse' : 'Read more', {
                        ns: 'user_settings',
                      })}
                    </button>
                  )}

                  {!state.isPhoneVerification && (
                    <div className={cn(s.formBlock, s.promocodeBlock)}>
                      <div className={cn(s.formFieldsBlock, s.first, s.promocode)}>
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="promocode"
                          disabled={state.isDedicWithSale}
                          label={`${t('Promo code')}:`}
                          placeholder={t('Enter promo code', { ns: 'other' })}
                          isShadow
                          className={s.inputPerson}
                          error={!!errors.promocode}
                          touched={!!touched.promocode}
                          value={values.promocode}
                          onChange={e => setState({ promocode: e.target.value })}
                        />
                        <button
                          onClick={() => setPromocodeToCart(values?.promocode)}
                          disabled={Boolean(!values?.promocode?.length)}
                          type="button"
                          className={s.promocodeBtn}
                        >
                          {t('Apply', { ns: 'other' })}
                        </button>
                      </div>

                      {state.isDedicWithSale ? (
                        <div className={s.sale55Promo}>{t('dedic_sale_text')}</div>
                      ) : null}
                    </div>
                  )}
                </>
              )}
              <div className={s.totalSum}>
                <span>
                  {state.cartData?.full_discount &&
                  Number(state.cartData?.full_discount) !== 0 ? (
                    <>
                      {t('Saving')}:{' '}
                      <b>{roundToDecimal(state.cartData?.full_discount)} EUR</b>
                      <button type="button" className={s.infoBtn}>
                        <Icon name="Info" />
                        <div ref={dropdownSale} className={s.descriptionBlock}>
                          {renderActiveDiscounts()}
                        </div>
                      </button>
                    </>
                  ) : null}
                </span>
                {Number(state.cartData?.tax) > 0 ? (
                  <div className={s.priceBlock}>
                    {t('Tax')}:<b>{roundToDecimal(state.cartData?.tax)} EUR</b>
                  </div>
                ) : null}
                <div className={s.priceBlock}>
                  {t('Total')}
                  {Number(state.cartData?.tax) > 0 &&
                    ' (' + t('Tax included').toLocaleLowerCase() + ')'}
                  : <b>{roundToDecimal(state.cartData?.total_sum)} EUR</b>
                </div>
              </div>

              <div className={s.offerBlock}>
                <CheckBox
                  value={values[OFFER_FIELD] || false}
                  onClick={() => setState({ isPolicyChecked: !state.isPolicyChecked })}
                  name={OFFER_FIELD}
                  className={s.checkbox}
                  error={!!errors[OFFER_FIELD]}
                  touched={!!touched[OFFER_FIELD]}
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
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
