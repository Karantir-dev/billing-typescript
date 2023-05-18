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
  SelectGeo,
} from '..'
import {
  cartOperations,
  payersOperations,
  payersSelectors,
  selectors,
  authSelectors,
} from '../../Redux'
import * as Yup from 'yup'
import s from './Cart.module.scss'
import { BASE_URL, PRIVACY_URL, OFERTA_URL } from '../../config/config'
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

  const [salesList, setSalesList] = useState([])
  const [isDedicWithSale, setIsDedicWithSale] = useState(false)

  const [selectedPayerFields, setSelectedPayerFields] = useState(null)

  const [cartData, setCartData] = useState(null)

  const [isClosing, setIsClosing] = useState(false)

  const [blackFridayData, setBlackFridayData] = useState(null)
  const [showMore, setShowMore] = useState(false)
  const [showAllItems, setShowAllItems] = useState(false)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [selectedPayMethod, setSelectedPayMethod] = useState(undefined)
  const [isOffer, setIsOffer] = useState(false)

  const geoData = useSelector(authSelectors.getGeoData)

  const isLoading = useSelector(selectors.getIsLoadding)
  const payersList = useSelector(payersSelectors.getPayersList)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  const [payerFieldList, setPayerFieldList] = useState(null)
  const [profileType, setProfileType] = useState('')
  const [company, setCompany] = useState('')
  const [person, setPerson] = useState(null)
  const [cityPhysical, setCityPhysical] = useState(null)
  const [addressPhysical, setAddressPhysical] = useState(null)
  const [euVat, setEUVat] = useState('')
  const [promocode, setPromocode] = useState('')

  useEffect(() => {
    dispatch(cartOperations.getBasket(setCartData, setPaymentsMethodList))
    dispatch(cartOperations.getSalesList(setSalesList))
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
          payersOperations.getPayerEditInfo(
            data,
            false,
            null,
            setSelectedPayerFields,
            true,
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

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (selectedPayerFields && !selectedPayerFields?.offer_field) {
      setSelectedPayerFields(d => {
        return { ...d, offer_field: 'offer_3' }
      })
    }
  }, [selectedPayerFields])

  //isPersonalBalance

  const validationSchema = Yup.object().shape({
    profile:
      payersList?.length !== 0
        ? Yup.string().when('isPersonalBalance', {
            is: 'off',
            then: Yup.string().required(t('Choose payer')),
          })
        : null,
    person: Yup.string().when('isPersonalBalance', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    address_physical: Yup.string().when('isPersonalBalance', {
      is: 'off',
      then: Yup.string()
        .matches(/^[^@#$%^&*!~<>]+$/, t('symbols_restricted', { ns: 'other' }))
        .matches(/(?=\d)/, t('address_error_msg', { ns: 'other' }))
        .required(t('Is a required field', { ns: 'other' })),
    }),

    name:
      payersSelectedFields?.profiletype === '2' ||
      payersSelectedFields?.profiletype === '3'
        ? Yup.string().when('isPersonalBalance', {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          })
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
        selectedPayerFields?.country ||
        selectedPayerFields?.country_physical ||
        selectedPayerFields?.country ||
        selectedPayerFields?.country_physical ||
        '',
      country_legal:
        selectedPayerFields?.country ||
        selectedPayerFields?.country_physical ||
        selectedPayerFields?.country ||
        selectedPayerFields?.country_physical ||
        '',
      billorder: cartData?.billorder,
      amount: cartData?.total_sum,
      profile: values?.profile === 'new' ? '' : values?.profile,
      paymethod: values?.selectedPayMethod?.paymethod?.$,
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

    if (values?.selectedPayMethod?.action?.button?.$name === 'fromsubaccount') {
      data['clicked_button'] = 'fromsubaccount'
    }

    const cart = { ...cartData, payment_name: values?.selectedPayMethod?.name?.$ }
    dispatch(cartOperations.setPaymentMethods(data, navigate, cart))
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

    const maxItemsToShow = screenWidth < 768 ? 1 : 3
    let displayedItems = []

    switch (true) {
      case vpnList?.length > 0:
        displayedItems = showAllItems ? vpnList : vpnList.slice(0, maxItemsToShow)
        break
      case siteCareList?.length > 0:
        displayedItems = showAllItems
          ? siteCareList
          : siteCareList.slice(0, maxItemsToShow)
        break
      case filteredVhostList?.length > 0:
        displayedItems = showAllItems
          ? filteredVhostList
          : filteredVhostList.slice(0, maxItemsToShow)
        break
      case domainsList?.length > 0:
        displayedItems = showAllItems ? domainsList : domainsList.slice(0, maxItemsToShow)
        break
      case filteredDedicList?.length > 0:
        displayedItems = showAllItems
          ? filteredDedicList
          : filteredDedicList.slice(0, maxItemsToShow)
        break
      case filteredVdsList?.length > 0:
        displayedItems = showAllItems
          ? filteredVdsList
          : filteredVdsList.slice(0, maxItemsToShow)
        break
      case filteredFtpList?.length > 0:
        displayedItems = showAllItems
          ? filteredFtpList
          : filteredFtpList.slice(0, maxItemsToShow)
        break
      case filteredDnsList?.length > 0:
        displayedItems = showAllItems
          ? filteredDnsList
          : filteredDnsList.slice(0, maxItemsToShow)
        break
      case filteredForexList?.length > 0:
        displayedItems = showAllItems
          ? filteredForexList
          : filteredForexList.slice(0, maxItemsToShow)
        break
      default:
        console.error('Error: Product was not selected')
        break
    }

    const shouldRenderButton = listLength =>
      screenWidth < 768 ? listLength > 1 : listLength > 3

    const showMoreButton = listLength => {
      const toggleShowAllItems = () => setShowAllItems(!showAllItems)

      return (
        <button className={s.showMoreItemsBtn} onClick={toggleShowAllItems}>
          {!showAllItems
            ? `${t('Show')} ${listLength - displayedItems.length} ${t('more items')}`
            : t('Hide')}
        </button>
      )
    }

    return (
      <>
        {vpnList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('Site care')}:</div>
            <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
              {displayedItems?.map(el => {
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
                      domainsList?.length > 1
                        ? () => deleteBasketItemHandler(id?.$)
                        : null
                    }
                  />
                )
              })}
            </div>
            {shouldRenderButton(vpnList.length) && showMoreButton(vpnList.length)}
          </div>
        )}
        {siteCareList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('Site care')}:</div>
            <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
              {displayedItems?.map(el => {
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
                      domainsList?.length > 1
                        ? () => deleteBasketItemHandler(id?.$)
                        : null
                    }
                  />
                )
              })}
            </div>
            {shouldRenderButton(siteCareList.length) &&
              showMoreButton(siteCareList.length)}
          </div>
        )}
        {filteredVhostList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('vhost', { ns: 'crumbs' })}:</div>
            <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
              {displayedItems?.map(el => {
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
            {shouldRenderButton(filteredVhostList.length) &&
              showMoreButton(filteredVhostList.length)}
          </div>
        )}
        {domainsList?.length > 0 && (
          <>
            <div className={s.padding}>
              <div className={s.formBlockTitle}>{t('Domain registration')}:</div>
              <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
                {displayedItems?.map(el => {
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
            </div>
            {shouldRenderButton(domainsList.length) && showMoreButton(domainsList.length)}
          </>
        )}
        {filteredDedicList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>
              {t('dedicated_server', { ns: 'dedicated_servers' })}:
            </div>
            <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
              {displayedItems?.map(el => {
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
            {shouldRenderButton(filteredVhostList.length) &&
              showMoreButton(filteredDedicList?.length)}
          </div>
        )}
        {filteredVdsList?.length > 0 && (
          <div className={s.vds_wrapper}>
            <div className={cn(s.formBlockTitle, s.padding)}>
              {t('services.Virtual server', { ns: 'other' })}:
            </div>

            <div className={s.padding}>
              <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
                {displayedItems?.map(el => {
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
              {shouldRenderButton(filteredVdsList.length) &&
                showMoreButton(filteredVdsList?.length)}
            </div>
          </div>
        )}
        {filteredFtpList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>
              {t('services.External FTP-storage', { ns: 'other' })}:{' '}
            </div>
            <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
              {displayedItems?.map(el => {
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
            {shouldRenderButton(filteredFtpList.length) &&
              showMoreButton(filteredFtpList.length)}
          </div>
        )}
        {filteredDnsList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('dns', { ns: 'crumbs' })}:</div>
            <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
              {displayedItems?.map(el => {
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
            {shouldRenderButton(filteredFtpList.length) &&
              showMoreButton(filteredDnsList?.length)}
          </div>
        )}
        {filteredForexList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>{t('forex', { ns: 'crumbs' })}:</div>
            <div className={cn(s.elements_wrapper, { [s.opened]: showAllItems })}>
              {displayedItems?.map(el => {
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
            {shouldRenderButton(filteredFtpList.length) &&
              showMoreButton(filteredForexList?.length)}
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

  useEffect(() => {
    const cartConfigName = cartData?.elemList[0]?.pricelist_name.$?.slice(
      0,
      cartData?.elemList[0]?.pricelist_name.$.indexOf('/') - 1,
    )

    const foundSale = salesList.find(
      sale =>
        sale.promotion.$ === 'Большие скидки на выделенные серверы' &&
        sale.idname.$.includes(cartConfigName),
    )

    const cartDiscountPercent =
      cartData?.elemList[0]?.discount_percent?.$.replace('%', '') || 0
    const selectedPeriod = cartData?.elemList[0]?.['item.period']?.$

    if (foundSale) {
      if (
        (selectedPeriod === '12' && Number(cartDiscountPercent) <= 8) ||
        (selectedPeriod === '24' && Number(cartDiscountPercent) <= 10) ||
        (selectedPeriod === '36' && Number(cartDiscountPercent) <= 12) ||
        cartDiscountPercent === 0
      ) {
        setIsDedicWithSale(false)
      } else {
        setIsDedicWithSale(true)
      }
    }
  }, [salesList])

  const payerTypeArrayHandler = () => {
    const arr = payerFieldList?.profiletype
      ? payerFieldList?.profiletype
      : payersSelectLists?.profiletype

    return arr?.map(({ $key, $ }) => ({
      label: t(`${$.trim()}`, { ns: 'payers' }),
      value: $key,
    }))
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
            <div className={s.scroll}>
              <div className={s.itemsBlock}>{renderItems()}</div>

              <Formik
                enableReinitialize
                validationSchema={validationSchema}
                initialValues={{
                  profile:
                    selectedPayerFields?.profile ||
                    payersList[payersList?.length - 1]?.id?.$,
                  name: company || selectedPayerFields?.name || '',
                  address_physical:
                    addressPhysical ?? selectedPayerFields?.address_physical,
                  city_physical:
                    cityPhysical ??
                    (selectedPayerFields?.city_physical || geoData?.clients_city),
                  person: person ?? selectedPayerFields?.person,
                  country:
                    selectedPayerFields?.country ||
                    selectedPayerFields?.country_physical ||
                    '',
                  profiletype: profileType || selectedPayerFields?.profiletype,
                  eu_vat: euVat || selectedPayerFields?.eu_vat || '',
                  [selectedPayerFields?.offer_field]: isOffer,

                  selectedPayMethod: selectedPayMethod || undefined,
                  promocode: promocode,
                  isPersonalBalance:
                    selectedPayMethod?.name?.$?.includes('balance') &&
                    selectedPayMethod?.paymethod_type?.$ === '0'
                      ? 'on'
                      : 'off',
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
                    values?.selectedPayMethod &&
                    parsePaymentInfo(values?.selectedPayMethod?.desc?.$)

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

                  return (
                    <Form className={s.form}>
                      <ScrollToFieldError />
                      <div className={cn(s.formBlock, s.padding)}>
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
                                      setFieldValue('selectedPayMethod', method)
                                      setSelectedPayMethod(method)

                                      if (
                                        method?.name?.$?.includes('balance') &&
                                        method?.paymethod_type?.$ === '0'
                                      ) {
                                        setFieldValue('isPersonalBalance', 'on')
                                      } else {
                                        setFieldValue('isPersonalBalance', 'off')
                                      }
                                    }}
                                    type="button"
                                    className={cn(s.paymentMethodBtn, {
                                      [s.selected]:
                                        paymethod_type?.$ ===
                                          values?.selectedPayMethod?.paymethod_type?.$ &&
                                        paymethod?.$ ===
                                          values?.selectedPayMethod?.paymethod?.$,
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
                          name={'selectedPayMethod'}
                          component="span"
                        />
                      </div>
                      {(values?.selectedPayMethod?.name?.$?.includes('balance') &&
                        values?.selectedPayMethod?.paymethod_type?.$ === '0') ||
                      !values?.selectedPayMethod ? null : (
                        <div className={(s.formBlock, s.padding)}>
                          <div className={s.formBlockTitle}>{t('Payer')}:</div>
                          <div className={s.fieldsGrid}>
                            <Select
                              placeholder={t('Not chosen', { ns: 'other' })}
                              label={`${t('Payer status', { ns: 'payers' })}:`}
                              value={values.profiletype}
                              getElement={item => {
                                setFieldValue('profiletype', item)
                                setProfileType(item)
                              }}
                              isShadow
                              className={s.select}
                              dropdownClass={s.selectDropdownClass}
                              itemsList={payerTypeArrayHandler()}
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
                                value={values.name}
                                onChange={e => setCompany(e.target.value)}
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
                              value={values.person}
                              onChange={e => setPerson(e.target.value)}
                            />

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
                              className={s.inputBig}
                              error={!!errors.city_physical}
                              touched={!!touched.city_physical}
                              value={values.city_physical}
                              onChange={e => setCityPhysical(e.target.value)}
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
                                  setAddressPhysical(val)
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
                                value={values.eu_vat}
                                onChange={e => setEUVat(e.target.value)}
                              />
                            ) : null}
                          </div>
                        </div>
                      )}
                      {values?.selectedPayMethod &&
                        values?.selectedPayMethod?.payment_minamount && (
                          <div
                            className={cn(s.infotext, s.padding, {
                              [s.showMore]: showMore,
                            })}
                          >
                            <div>
                              <span>
                                {t(`${parsedText?.minAmount?.trim()}`, { ns: 'cart' })}
                              </span>
                              {parsedText?.infoText && (
                                <p>
                                  {t(`${parsedText?.infoText?.trim()}`, { ns: 'cart' })}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      {values?.selectedPayMethod && readMore && (
                        <button
                          type="button"
                          onClick={() => setShowMore(!showMore)}
                          className={cn(s.readMore, s.padding)}
                        >
                          {t(showMore ? 'Collapse' : 'Read more')}
                        </button>
                      )}

                      <div className={cn(s.formBlock, s.promocodeBlock, s.padding)}>
                        <div className={cn(s.formFieldsBlock, s.first, s.promocode)}>
                          <InputField
                            inputWrapperClass={s.inputHeight}
                            name="promocode"
                            disabled={isDedicWithSale}
                            label={`${t('Promo code')}:`}
                            placeholder={t('Enter promo code', { ns: 'other' })}
                            isShadow
                            className={s.inputPerson}
                            error={!!errors.promocode}
                            touched={!!touched.promocode}
                            value={values.promocode}
                            onChange={e => setPromocode(e.target.value)}
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

                        {isDedicWithSale ? (
                          <div className={s.sale55Promo}>{t('dedic_sale_text')}</div>
                        ) : null}

                        <div className={cn(s.formFieldsBlock)}>
                          {blackFridayData && blackFridayData?.success && (
                            <BlackFridayGift code={blackFridayData?.promo_of_service} />
                          )}
                        </div>
                      </div>
                      {VDS_FEE_AMOUNT && VDS_FEE_AMOUNT > 0 ? (
                        <div className={cn(s.padding, s.penalty_sum)}>
                          {t('Late fee')}: <b>{VDS_FEE_AMOUNT.toFixed(4)} EUR</b>
                        </div>
                      ) : (
                        ''
                      )}
                      <div className={s.padding}>
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
                            value={values[selectedPayerFields?.offer_field] || false}
                            onClick={() => setIsOffer(prev => !prev)}
                            name={selectedPayerFields?.offer_field}
                            className={s.checkbox}
                            error={!!errors[selectedPayerFields?.offer_field]}
                            touched={!!touched[selectedPayerFields?.offer_field]}
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
                      {Number(cartData?.tax) > 0 ? (
                        <div className={cn(s.totalSum, s.padding)}>
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
                                values?.selectedPayMethod?.payment_minamount?.$ ||
                              !values?.selectedPayMethod
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
