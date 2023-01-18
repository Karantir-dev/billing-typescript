import React, { useEffect, useState, useRef } from 'react'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import * as routes from '../../routes'
import { Cross, Check, Info } from '../../images'
import {
  Select,
  InputField,
  Button,
  CheckBox,
  DomainItem,
  DedicItem,
  VdsItem,
  FtpItem,
  DnsItem,
  VhostItem,
  ForexItem,
  SiteCareItem,
  VpnItem,
  InputWithAutocomplete,
  ScrollToFieldError,
  BlackFridayGift,
} from '..'
import {
  cartOperations,
  payersOperations,
  payersSelectors,
  selectors,
  billingOperations,
  authSelectors,
} from '../../Redux'
import * as Yup from 'yup'
import s from './Cart.module.scss'
import { BASE_URL, PRIVACY_URL, OFERTA_URL, SALE_55_PROMOCODE } from '../../config/config'
import { replaceAllFn } from '../../utils'

export default function Component() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const dropdownDescription = useRef(null)
  const dropdownSale = useRef(null)

  const { t } = useTranslation([
    'cart',
    'other',
    'payers',
    'billing',
    'dedicated_servers',
    'crumbs',
    'domains',
  ])

  const [paymentsMethodList, setPaymentsMethodList] = useState([])

  const [selectedPayerFields, setSelectedPayerFields] = useState(null)

  const [cartData, setCartData] = useState(null)

  const [isClosing, setIsClosing] = useState(false)

  const [blackFridayData, setBlackFridayData] = useState(null)

  const geoData = useSelector(authSelectors.getGeoData)

  const isLoading = useSelector(selectors.getIsLoadding)
  const payersList = useSelector(payersSelectors.getPayersList)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  useEffect(() => {
    dispatch(cartOperations.getBasket(setCartData, setPaymentsMethodList))
    dispatch(billingOperations.getPayers())
  }, [])

  useEffect(() => {
    if (payersSelectLists) {
      if (!payersSelectedFields?.country || !payersSelectedFields?.country_physical) {
        const data = {
          country: payersSelectLists?.country[0]?.$key,
          profiletype: payersSelectLists?.profiletype[0]?.$key,
        }
        dispatch(payersOperations.getPayerModalInfo(data))
      }
    }
  }, [payersSelectLists])

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

  const validationSchema = Yup.object().shape({
    profile: payersList?.length !== 0 ? Yup.string().required(t('Choose payer')) : null,
    slecetedPayMethod: Yup.object().required(t('Select a Payment Method')),
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
    [selectedPayerFields?.offer_field]: Yup.bool().oneOf([true]),
  })

  // const offerTextHandler = () => {
  //   dispatch(payersOperations.getPayerOfferText(payersSelectedFields?.offer_link))
  // }

  const setPromocodeToCart = promocode => {
    dispatch(
      cartOperations.setBasketPromocode(
        promocode,
        setCartData,
        setPaymentsMethodList,
        setBlackFridayData,
        cartData?.elemList[0]['item.type']?.$,
      ),
    )
  }

  const deleteBasketItemHandler = item_id => {
    dispatch(cartOperations.deleteBasketItem(item_id, setCartData, setPaymentsMethodList))
  }

  const closeBasketHamdler = basket_id => {
    dispatch(cartOperations.clearBasket(basket_id))
  }

  const payBasketHandler = values => {
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
        selectedPayerFields?.country || selectedPayerFields?.country_physical || '',
      country_legal:
        selectedPayerFields?.country || selectedPayerFields?.country_physical || '',
      billorder: cartData?.billorder,
      amount: cartData?.total_sum,
      profile: values?.profile === 'new' ? '' : values?.profile,
      paymethod: values?.slecetedPayMethod?.paymethod?.$,
      country:
        selectedPayerFields?.country || selectedPayerFields?.country_physical || '',
      profiletype: values?.profiletype || '',
      person:
        payersList?.find(e => e?.id?.$ === values?.profile)?.name?.$ ||
        values?.person ||
        ' ',
      director:
        payersList?.find(e => e?.id?.$ === values?.profile)?.name?.$ ||
        values?.person ||
        ' ',
      promocode: values?.promocode || '',
      name: values?.person,
      [selectedPayerFields?.offer_field]: values[selectedPayerFields?.offer_field]
        ? 'on'
        : 'off',
    }

    if (values?.slecetedPayMethod?.action?.button?.$name === 'fromsubaccount') {
      data['clicked_button'] = 'fromsubaccount'
    }
    dispatch(cartOperations.setPaymentMethods(data, navigate, cartData))
  }

  let VDS_FEE_AMOUNT = ''

  const renderItems = () => {
    const domainsList = cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'domain',
    )
    const dedicList = cartData?.elemList?.filter(elem => elem['item.type']?.$ === 'dedic')
    const vdsList = cartData?.elemList?.filter(elem => elem['item.type']?.$ === 'vds')
    const ftpList = cartData?.elemList?.filter(elem => elem['item.type']?.$ === 'storage')
    const dnsList = cartData?.elemList?.filter(elem => elem['item.type']?.$ === 'dnshost')
    const forexList = cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'forexbox',
    )
    const vhostList = cartData?.elemList?.filter(elem => elem['item.type']?.$ === 'vhost')

    const siteCareList = cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'zabota-o-servere',
    )

    const vpnList = cartData?.elemList?.filter(elem => elem['item.type']?.$ === 'vpn')

    const filteredVdsList = []

    vdsList?.forEach(elem => {
      if (
        filteredVdsList?.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
          ?.length === 0
      ) {
        filteredVdsList?.push({
          ...elem,
          count: vdsList.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
            ?.length,
        })
      }
    })

    //penalty for vds
    const vdsWithPenalty = vdsList?.filter(el => {
      return el?.desc?.$?.includes('fee will be charged')
    })

    const VDS_FEE_AMOUNT_ARRAY = []

    if (vdsWithPenalty?.length > 0) {
      vdsWithPenalty.forEach(el => {
        const penaltyPrice = el?.desc?.$?.match(/time: (.+?)(?= EUR)/)?.[1]
        VDS_FEE_AMOUNT_ARRAY.push(penaltyPrice)
      })
    }
    const vdsTotalPenalty = VDS_FEE_AMOUNT_ARRAY?.reduce(
      (acc, curr) => Number(curr) + Number(acc),
      0,
    )

    VDS_FEE_AMOUNT = vdsTotalPenalty
    //penalty for vds

    const filteredDnsList = []

    dnsList?.forEach(elem => {
      if (
        filteredDnsList?.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
          ?.length === 0
      ) {
        filteredDnsList?.push({
          ...elem,
          count: dnsList.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
            ?.length,
        })
      }
    })

    const filteredFtpList = []

    ftpList?.forEach(elem => {
      if (
        filteredFtpList?.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
          ?.length === 0
      ) {
        filteredFtpList?.push({
          ...elem,
          count: ftpList.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
            ?.length,
        })
      }
    })

    const filteredForexList = []

    forexList?.forEach(elem => {
      if (
        filteredForexList?.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
          ?.length === 0
      ) {
        filteredForexList?.push({
          ...elem,
          count: forexList.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
            ?.length,
        })
      }
    })

    const filteredDedicList = []

    dedicList?.forEach(elem => {
      if (
        filteredDedicList?.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
          ?.length === 0
      ) {
        filteredDedicList?.push({
          ...elem,
          count: dedicList.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
            ?.length,
        })
      }
    })

    const filteredVhostList = []

    vhostList?.forEach(elem => {
      if (
        filteredVhostList?.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
          ?.length === 0
      ) {
        filteredVhostList?.push({
          ...elem,
          count: vhostList.filter(e => e?.pricelist_name?.$ === elem?.pricelist_name?.$)
            ?.length,
        })
      }
    })

    return (
      <>
        {vpnList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('Site care')}:</div>
            {vpnList?.map(el => {
              const { id, desc, cost, pricelist_name, discount_percent, fullcost } = el
              return (
                <VpnItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  discount_percent={discount_percent?.$}
                  fullcost={fullcost?.$}
                  itemId={el['item.id']?.$}
                  pricelist_name={pricelist_name?.$}
                  deleteItemHandler={
                    domainsList?.length > 1 ? () => deleteBasketItemHandler(id?.$) : null
                  }
                />
              )
            })}
          </div>
        )}
        {siteCareList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('Site care')}:</div>
            {siteCareList?.map(el => {
              const { id, desc, cost, pricelist_name, discount_percent, fullcost } = el
              return (
                <SiteCareItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  discount_percent={discount_percent?.$}
                  fullcost={fullcost?.$}
                  itemId={el['item.id']?.$}
                  pricelist_name={pricelist_name?.$}
                  deleteItemHandler={
                    domainsList?.length > 1 ? () => deleteBasketItemHandler(id?.$) : null
                  }
                />
              )
            })}
          </div>
        )}
        {filteredVhostList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('vhost', { ns: 'crumbs' })}:</div>
            {filteredVhostList?.map(el => {
              const {
                id,
                desc,
                cost,
                pricelist_name,
                discount_percent,
                fullcost,
                count,
              } = el
              return (
                <VhostItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  discount_percent={discount_percent?.$}
                  fullcost={fullcost?.$}
                  itemId={el['item.id']?.$}
                  pricelist_name={pricelist_name?.$}
                  deleteItemHandler={
                    filteredVhostList?.length > 1
                      ? () => deleteBasketItemHandler(id?.$)
                      : null
                  }
                  count={count}
                />
              )
            })}
          </div>
        )}
        {domainsList?.length > 0 && (
          <>
            <div className={cn(s.formBlockTitle, s.padding)}>
              {t('Domain registration')}:
            </div>
            <div className={s.scroll}>
              {domainsList?.map(el => {
                const { id, desc, cost, fullcost, discount_percent } = el
                return (
                  <DomainItem
                    key={id?.$}
                    desc={desc?.$}
                    cost={cost?.$}
                    fullcost={fullcost?.$}
                    discount_percent={discount_percent?.$}
                    deleteItemHandler={
                      domainsList?.length > 1
                        ? () => deleteBasketItemHandler(id?.$)
                        : null
                    }
                  />
                )
              })}
            </div>
          </>
        )}
        {filteredDedicList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>
              {t('dedicated_server', { ns: 'dedicated_servers' })}:
            </div>
            {filteredDedicList?.map(el => {
              const {
                id,
                desc,
                cost,
                fullcost,
                discount_percent,
                pricelist_name,
                count,
              } = el
              return (
                <DedicItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  fullcost={fullcost?.$}
                  discount_percent={discount_percent?.$}
                  pricelist_name={pricelist_name?.$}
                  count={count}
                  deleteItemHandler={
                    filteredDedicList?.length > 1
                      ? () => deleteBasketItemHandler(id?.$)
                      : null
                  }
                />
              )
            })}
          </div>
        )}
        {filteredVdsList?.length > 0 && (
          <div className={s.vds_wrapper}>
            <div className={cn(s.formBlockTitle, s.padding)}>
              {t('services.Virtual server', { ns: 'other' })}:
            </div>

            <div className={s.padding}>
              {filteredVdsList?.map(el => {
                return (
                  <VdsItem
                    key={el?.id?.$}
                    el={el}
                    deleteItemHandler={
                      filteredVdsList?.length > 1
                        ? () => deleteBasketItemHandler(el?.id?.$)
                        : null
                    }
                  />
                )
              })}
            </div>
          </div>
        )}
        {filteredFtpList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>
              {t('services.External FTP-storage', { ns: 'other' })}:{' '}
            </div>
            {filteredFtpList?.map(el => {
              const {
                id,
                desc,
                cost,
                fullcost,
                discount_percent,
                pricelist_name,
                count,
              } = el
              return (
                <FtpItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  fullcost={fullcost?.$}
                  discount_percent={discount_percent?.$}
                  pricelist_name={pricelist_name?.$}
                  count={count}
                  deleteItemHandler={
                    filteredFtpList?.length > 1
                      ? () => deleteBasketItemHandler(id?.$)
                      : null
                  }
                />
              )
            })}
          </div>
        )}
        {filteredDnsList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('dns', { ns: 'crumbs' })}:</div>
            {filteredDnsList?.map(el => {
              const {
                id,
                desc,
                cost,
                fullcost,
                discount_percent,
                pricelist_name,
                count,
              } = el
              return (
                <DnsItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  fullcost={fullcost?.$}
                  discount_percent={discount_percent?.$}
                  pricelist_name={pricelist_name?.$}
                  count={count}
                  deleteItemHandler={
                    filteredDnsList?.length > 1
                      ? () => deleteBasketItemHandler(id?.$)
                      : null
                  }
                />
              )
            })}
          </div>
        )}
        {filteredForexList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('forex', { ns: 'crumbs' })}:</div>
            {filteredForexList?.map(el => {
              const {
                id,
                desc,
                cost,
                fullcost,
                discount_percent,
                pricelist_name,
                count,
              } = el
              return (
                <ForexItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  fullcost={fullcost?.$}
                  discount_percent={discount_percent?.$}
                  pricelist_name={pricelist_name?.$}
                  count={count}
                  deleteItemHandler={
                    filteredForexList?.length > 1
                      ? () => deleteBasketItemHandler(id?.$)
                      : null
                  }
                />
              )
            })}
          </div>
        )}
      </>
    )
  }

  const renderActiveDiscounts = () => {
    const arr = cartData?.elemList[0]?.price_hint?.$?.split('<br/>')

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
            let result = str?.match(/(-?\d+(\.\d+)?)/g)?.map(v => +v)
            return result
          }
          if (getString(e)?.length !== 0) {
            return (
              <p
                key={e}
                className={s.discItem}
                dangerouslySetInnerHTML={{
                  __html: e
                    ?.replace(' -', ':')
                    ?.replace('%', '')
                    ?.replace(
                      getString(e?.replace(' -', ':'))[0],
                      `<span style='color: #FA6848'>-${
                        getString(e?.replace(' -', ':'))[0]
                      }%</span>`,
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

  return (
    <div className={cn(s.modalBg, { [s.closing]: isClosing })}>
      {payersSelectedFields && selectedPayerFields && payersSelectLists ? (
        !isClosing ? (
          <div className={s.modalBlock}>
            <div className={cn(s.modalHeader, s.padding)}>
              <span className={s.headerText}>{t('Payment')}</span>
              <Cross onClick={() => setIsClosing(true)} className={s.crossIcon} />
            </div>

            <div className={s.itemsBlock}>{renderItems()}</div>

            <div className={s.padding}>
              <Formik
                enableReinitialize
                validationSchema={validationSchema}
                initialValues={{
                  profile:
                    selectedPayerFields?.profile ||
                    payersList[payersList?.length - 1]?.id?.$,
                  name: selectedPayerFields?.name || '',
                  address_physical: selectedPayerFields?.address_physical || '',
                  city_physical:
                    selectedPayerFields?.city_physical || geoData?.clients_city || '',
                  person: selectedPayerFields?.person || '',
                  country:
                    selectedPayerFields?.country ||
                    selectedPayerFields?.country_physical ||
                    '',
                  profiletype: selectedPayerFields?.profiletype,
                  eu_vat: selectedPayerFields?.eu_vat || '',
                  [selectedPayerFields?.offer_field]: false,

                  slecetedPayMethod: undefined,
                  promocode: '',
                }}
                onSubmit={payBasketHandler}
              >
                {({ values, setFieldValue, touched, errors }) => {
                  const parsePaymentInfo = text => {
                    const splittedText = text?.split('<p>')
                    if (splittedText?.length > 0) {
                      const minAmount = splittedText[0]?.replace('\n', '')

                      let infoText = ''

                      if (splittedText[1]) {
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
                    <Form className={s.form}>
                      <ScrollToFieldError />
                      <div className={s.formBlock}>
                        {!isLoading && paymentsMethodList?.length === 0 && (
                          <div className={s.notAllowPayMethod}>
                            {t('order_amount_is_less')}
                          </div>
                        )}
                        {paymentsMethodList?.length > 0 && (
                          <>
                            <div className={s.formBlockTitle}>{t('Payment method')}:</div>
                            <div className={s.formFieldsBlock}>
                              {paymentsMethodList?.map(method => {
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
                                      setFieldValue('slecetedPayMethod', method)
                                    }}
                                    type="button"
                                    className={cn(s.paymentMethodBtn, {
                                      [s.selected]:
                                        paymethod_type?.$ ===
                                          values?.slecetedPayMethod?.paymethod_type?.$ &&
                                        paymethod?.$ ===
                                          values?.slecetedPayMethod?.paymethod?.$,
                                    })}
                                    key={name?.$}
                                  >
                                    <img src={`${BASE_URL}${image?.$}`} alt="icon" />
                                    <span>
                                      {paymentName}
                                      {balance?.length > 0 && (
                                        <>
                                          <br />{' '}
                                          <span className={s.balance}>
                                            {Number(balance).toFixed(2)} EUR
                                          </span>
                                        </>
                                      )}
                                    </span>
                                    <Check className={s.iconCheck} />
                                  </button>
                                )
                              })}
                            </div>
                          </>
                        )}

                        <ErrorMessage
                          className={s.error_message}
                          name={'slecetedPayMethod'}
                          component="span"
                        />
                      </div>
                      {(values?.slecetedPayMethod?.name?.$?.includes('balance') &&
                        values?.slecetedPayMethod?.paymethod_type?.$ === '0') ||
                      !values?.slecetedPayMethod ? null : (
                        <div className={s.formBlock}>
                          <div className={s.formBlockTitle}>{t('Payer')}:</div>
                          <div className={s.fieldsGrid}>
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
                            {values?.profiletype === '3' ||
                            values?.profiletype === '2' ? (
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
                            <div className={cn(s.nsInputBlock, s.inputBig)}>
                              {/* <InputField
                              inputWrapperClass={s.inputHeight}
                              inputClassName={s.inputAddressWrapp}
                              name="address_physical"
                              label={`${t('The address', { ns: 'other' })}:`}
                              placeholder={t('Enter address', { ns: 'other' })}
                              isShadow
                              className={cn(s.inputBig, s.inputAddress)}
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
                            {/* {selectedPayerFields?.offer_link && (
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
                                touched={!!touched[selectedPayerFields?.offer_field]}
                              />
                              <div className={s.offerBlockText}>
                                {t('I agree with the terms of the offer', {
                                  ns: 'payers',
                                })}
                                <br />
                                <a
                                  target="_blank"
                                  href={PRIVACY_URL}
                                  rel="noreferrer"
                                  className={s.offerBlockLink}
                                >
                                  {selectedPayerFields?.offer_name}
                                </a>
                              </div>
                            </div>
                          )} */}
                          </div>
                        </div>
                      )}
                      <div className={s.infotext}>
                        {values?.slecetedPayMethod &&
                          values?.slecetedPayMethod?.payment_minamount && (
                            <div>
                              <span>{t(`${parsedText?.minAmount}`, { ns: 'cart' })}</span>
                              {parsedText?.infoText && (
                                <p>{t(`${parsedText?.infoText}`, { ns: 'cart' })}</p>
                              )}
                            </div>
                          )}
                      </div>
                      <div className={cn(s.formBlock, s.promocodeBlock)}>
                        <div className={cn(s.formFieldsBlock, s.first, s.promocode)}>
                          <InputField
                            inputWrapperClass={s.inputHeight}
                            name="promocode"
                            label={`${t('Promo code')}:`}
                            placeholder={t('Enter promo code', { ns: 'other' })}
                            isShadow
                            className={s.inputPerson}
                            error={!!errors.promocode}
                            touched={!!touched.promocode}
                          />
                          <button
                            onClick={() => setPromocodeToCart(values?.promocode)}
                            disabled={values?.promocode?.length === 0}
                            type="button"
                            className={s.promocodeBtn}
                          >
                            {t('Apply', { ns: 'other' })}
                          </button>
                        </div>

                        {cartData?.elemList[0]?.price?.$?.includes(SALE_55_PROMOCODE) ? (
                          <div className={s.sale55Promo}>{t('sale_55_text')}</div>
                        ) : null}

                        <div className={cn(s.formFieldsBlock)}>
                          {blackFridayData && blackFridayData?.success && (
                            <BlackFridayGift code={blackFridayData?.promo_of_service} />
                          )}
                        </div>
                      </div>
                      {VDS_FEE_AMOUNT && VDS_FEE_AMOUNT > 0 ? (
                        <div className={s.penalty_sum}>
                          {t('Late fee')}: <b>{VDS_FEE_AMOUNT.toFixed(4)} EUR</b>
                        </div>
                      ) : (
                        ''
                      )}
                      <div className={s.totalSum}>
                        <b>{t('Total')}:</b>
                        <span>
                          {t('Excluding VAT')}: <b>{cartData?.total_sum} EUR</b>
                        </span>
                        <span>
                          {cartData?.full_discount &&
                          Number(cartData?.full_discount) !== 0 ? (
                            <>
                              {t('Saving')}: {cartData?.full_discount} EUR{' '}
                              <button type="button" className={s.infoBtn}>
                                <Info />
                                <div ref={dropdownSale} className={s.descriptionBlock}>
                                  {renderActiveDiscounts()}
                                </div>
                              </button>
                            </>
                          ) : null}
                        </span>
                      </div>

                      <div className={s.offerBlock}>
                        <CheckBox
                          initialState={values[selectedPayerFields?.offer_field] || false}
                          setValue={item =>
                            setFieldValue(`${selectedPayerFields?.offer_field}`, item)
                          }
                          className={s.checkbox}
                          error={!!errors[selectedPayerFields?.offer_field]}
                          touched={!!touched[selectedPayerFields?.offer_field]}
                        />
                        <div className={s.offerBlockText}>
                          {t('I agree with', {
                            ns: 'payers',
                          })}
                          {/* <br /> */}{' '}
                          <a
                            target="_blank"
                            href={PRIVACY_URL}
                            rel="noreferrer"
                            className={s.offerBlockLink}
                          >
                            {t('Terms of Service', { ns: 'domains' })}
                          </a>{' '}
                          {t('and', { ns: 'domains' })}{' '}
                          <a
                            target="_blank"
                            href={OFERTA_URL}
                            rel="noreferrer"
                            className={s.offerBlockLink}
                          >
                            {t('Terms of the offer', { ns: 'domains' })}
                          </a>
                        </div>
                      </div>

                      {Number(cartData?.tax) > 0 ? (
                        <div className={s.totalSum}>
                          {t('Tax included')}: <b>{cartData?.tax} EUR</b>
                        </div>
                      ) : null}
                      <div className={s.btnBlock}>
                        {paymentsMethodList?.length === 0 ? (
                          <Button
                            className={s.saveBtn}
                            isShadow
                            size="medium"
                            label={t('OK', { ns: 'billing' })}
                            type="button"
                            onClick={() => {
                              navigate(routes.BILLING)
                              closeBasketHamdler(cartData?.billorder)
                            }}
                          />
                        ) : (
                          <Button
                            disabled={
                              Number(values.amount) <
                                values?.slecetedPayMethod?.payment_minamount?.$ ||
                              !values?.slecetedPayMethod
                            }
                            className={s.saveBtn}
                            isShadow
                            size="medium"
                            label={t('Pay', { ns: 'billing' })}
                            type="submit"
                          />
                        )}

                        <button
                          onClick={() => setIsClosing(true)}
                          type="button"
                          className={s.cancel}
                        >
                          {t('Close', { ns: 'other' })}
                        </button>
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        ) : (
          <div className={s.modalCloseBlock}>
            <div className={s.closeText}>
              {t('After closing your order will be automatically deleted')}
            </div>
            <div className={s.btnCloseBlock}>
              <Button
                onClick={() => closeBasketHamdler(cartData?.billorder)}
                className={s.saveBtn}
                isShadow
                size="medium"
                label={t('OK')}
                type="button"
              />
              <button
                onClick={() => setIsClosing(false)}
                type="button"
                className={s.close}
              >
                {t('Cancel', { ns: 'other' })}
              </button>
            </div>
          </div>
        )
      ) : null}
    </div>
  )
}
