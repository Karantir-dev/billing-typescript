import { useEffect, useState, useRef, useReducer } from 'react'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import * as routes from '@src/routes'
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
  ScrollToFieldError,
  Icon,
  CustomPhoneInput,
  HintWrapper,
  PayersList,
} from '@components'
import {
  cartOperations,
  settingsOperations,
  payersSelectors,
  selectors,
  authSelectors,
  settingsSelectors,
  cartActions,
  userSelectors,
} from '@redux'
import * as Yup from 'yup'
import s from './Cart.module.scss'
import { PRIVACY_URL, OFERTA_URL } from '@config/config'
import { replaceAllFn, useFormFraudCheckData } from '@utils'
import { QIWI_PHONE_COUNTRIES, SBER_PHONE_COUNTRIES, OFFER_FIELD } from '@utils/constants'

export default function Component() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [state, setState] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  const dropdownSale = useRef(null)

  const { t } = useTranslation([
    'cart',
    'other',
    'payers',
    'billing',
    'dedicated_servers',
    'crumbs',
    'domains',
    'user_settings',
  ])

  const [paymentsMethodList, setPaymentsMethodList] = useState([])
  const [salesList, setSalesList] = useState([])
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const geoData = useSelector(authSelectors.getGeoData)

  const isLoading = useSelector(selectors.getIsLoading)
  const payersList = useSelector(payersSelectors.getPayersList)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersData = useSelector(payersSelectors.getPayersData)

  const filteredPayment_method = state.additionalPayMethodts?.find(
    e => e?.$key === state.selectedAddPaymentMethod,
  )

  const userEdit = useSelector(settingsSelectors.getUserEdit)
  const userInfo = useSelector(userSelectors.getUserInfo)

  const paymentListhandler = data => {
    setPaymentsMethodList(data)
    setState({ paymentListLoaded: true })
  }

  const setCartData = value => setState({ cartData: value })

  useEffect(() => {
    dispatch(cartOperations.getBasket(setCartData, paymentListhandler))
    dispatch(cartOperations.getSalesList(setSalesList))
    dispatch(settingsOperations.getUserEdit(userInfo.$id))
  }, [])

  useEffect(() => {
    if (state.additionalPayMethodts && state.additionalPayMethodts?.length > 0) {
      setState({ selectedAddPaymentMethod: state.additionalPayMethodts[0]?.$key })
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
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (userEdit) {
      const findCountry = userEdit?.phone_countries?.find(
        e => e?.$key === userEdit?.phone_country,
      )
      const code = findCountry?.$image?.slice(-6, -4)?.toLowerCase()
      setState({ userCountryCode: code })
    }
  }, [userEdit])

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
    city_physical: Yup.string().required(t('Is a required field', { ns: 'other' })),
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

  const deleteBasketItemHandler = item_id => {
    dispatch(cartOperations.deleteBasketItem(item_id, setCartData, paymentListhandler))
  }

  const closeBasketHamdler = basket_id => {
    dispatch(cartOperations.clearBasket(basket_id))
  }

  const fraudData = useFormFraudCheckData()

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
      profile: values?.profile,
      paymethod: values?.selectedPayMethod?.paymethod?.$,
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

    if (values.profiletype && values.profiletype !== '1') {
      data.jobtitle = payersData.selectedPayerFields?.jobtitle || 'jobtitle '
      data.rdirector = payersData.selectedPayerFields?.rdirector || 'rdirector '
      data.rjobtitle = payersData.selectedPayerFields?.rjobtitle || 'rjobtitle '
      data.ddirector = payersData.selectedPayerFields?.ddirector || 'ddirector '
      data.djobtitle = payersData.selectedPayerFields?.djobtitle || 'djobtitle '
      data.baseaction = payersData.selectedPayerFields?.baseaction || 'baseaction '
      data.name = values?.name || ''
    }

    const cart = { ...state.cartData, paymethod_name: values?.selectedPayMethod?.name?.$ }

    dispatch(cartOperations.setPaymentMethods(data, navigate, cart, fraudData))
  }

  const hideBasketHandler = () => {
    navigate(routes.PHONE_VERIFICATION, {
      state: { orderPage: location.pathname },
    })
    dispatch(cartActions.setCartIsOpenedState({ isOpened: false }))
  }

  let VDS_FEE_AMOUNT = ''

  const renderItems = () => {
    const domainsList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'domain',
    )
    const dedicList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'dedic',
    )
    const vdsList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'vds',
    )
    const ftpList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'storage',
    )
    const dnsList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'dnshost',
    )
    const forexList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'forexbox',
    )
    const vhostList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'vhost',
    )

    const siteCareList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'zabota-o-servere',
    )

    const vpnList = state.cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'vpn',
    )

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
        displayedItems = state.showAllItems ? vpnList : vpnList.slice(0, maxItemsToShow)
        break
      case siteCareList?.length > 0:
        displayedItems = state.showAllItems
          ? siteCareList
          : siteCareList.slice(0, maxItemsToShow)
        break
      case filteredVhostList?.length > 0:
        displayedItems = state.showAllItems
          ? filteredVhostList
          : filteredVhostList.slice(0, maxItemsToShow)
        break
      case domainsList?.length > 0:
        displayedItems = state.showAllItems
          ? domainsList
          : domainsList.slice(0, maxItemsToShow)
        break
      case filteredDedicList?.length > 0:
        displayedItems = state.showAllItems
          ? filteredDedicList
          : filteredDedicList.slice(0, maxItemsToShow)
        break
      case filteredVdsList?.length > 0:
        displayedItems = state.showAllItems
          ? filteredVdsList
          : filteredVdsList.slice(0, maxItemsToShow)
        break
      case filteredFtpList?.length > 0:
        displayedItems = state.showAllItems
          ? filteredFtpList
          : filteredFtpList.slice(0, maxItemsToShow)
        break
      case filteredDnsList?.length > 0:
        displayedItems = state.showAllItems
          ? filteredDnsList
          : filteredDnsList.slice(0, maxItemsToShow)
        break
      case filteredForexList?.length > 0:
        displayedItems = state.showAllItems
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
      const toggleShowAllItems = () => setState({ showAllItems: !state.showAllItems })

      return (
        <button className={s.showMoreItemsBtn} onClick={toggleShowAllItems}>
          {!state.showAllItems
            ? `${t('Show')} ${listLength - displayedItems.length} ${t('more items')}`
            : t('Hide')}
        </button>
      )
    }

    return (
      <>
        {vpnList?.length > 0 && (
          <div className={s.padding}>
            <div className={s.formBlockTitle}>VPN:</div>
            <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
                    period={el['item.period']?.$}
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
            <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
                    count={count}
                    period={el['item.period']?.$}
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
            <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
                    period={el['item.period']?.$}
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
              <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
                      period={el['item.period']?.$}
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
            <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
                    period={el['item.period']?.$}
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
              <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
            <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
                    period={el['item.period']?.$}
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
            <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
                    period={el['item.period']?.$}
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
            <div className={cn(s.elements_wrapper, { [s.opened]: state.showAllItems })}>
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
                    period={el['item.period']?.$}
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

  useEffect(() => {
    const cartConfigName = state.cartData?.elemList[0]?.pricelist_name.$?.slice(
      0,
      state.cartData?.elemList[0]?.pricelist_name.$.indexOf('/') - 1,
    )

    const foundSale = salesList.find(
      sale =>
        sale.promotion?.$ === 'Большие скидки на выделенные серверы' &&
        sale.idname.$.includes(cartConfigName),
    )

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
  }, [salesList])

  const renderPayersListTitle = () => (
    <div className={s.formBlockTitle}>{t('Payer')}:</div>
  )

  return (
    <div className={cn(s.modalBg, { [s.closing]: state.isClosing })}>
      {!state.isClosing ? (
        <div
          className={cn(s.modalBlock, {
            [s.visible]: payersSelectedFields && !!payersData.selectedPayerFields,
          })}
        >
          <div className={cn(s.modalHeader, s.padding)}>
            <span className={s.headerText}>{t('Payment')}</span>
            <Icon
              name="Cross"
              onClick={() => setState({ isClosing: true })}
              className={s.crossIcon}
            />
          </div>
          <div className={s.scroll}>
            <div className={s.itemsBlock}>
              {payersSelectedFields && payersData.selectedPayerFields && renderItems()}
            </div>

            <Formik
              enableReinitialize
              validationSchema={validationSchema}
              initialValues={{
                profile:
                  payersData.selectedPayerFields?.profile ||
                  payersList?.[payersList?.length - 1]?.id?.$ ||
                  '',
                name:
                  payersData.state?.name || payersData.selectedPayerFields?.name || '',
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
                  payersData.state?.person ??
                  payersData.selectedPayerFields?.person ??
                  '',
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
                [OFFER_FIELD]: state.isPolicyChecked || false,

                selectedPayMethod: state.selectedPayMethod || undefined,
                promocode: state.promocode,
                isPersonalBalance:
                  state.selectedPayMethod?.name?.$?.includes('balance') &&
                  state.selectedPayMethod?.paymethod_type?.$ === '0'
                    ? 'on'
                    : 'off',
                phone: state.phone || '',
                payment_method: state.selectedAddPaymentMethod || undefined,
                alfabank_login: state.alfaLogin || '',
              }}
              onSubmit={payBasketHandler}
            >
              {({ values, setFieldValue, touched, errors, handleBlur }) => {
                const parsePaymentInfo = text => {
                  const splittedText = text?.split('<p>')
                  if (splittedText?.length > 0) {
                    const minAmount = splittedText[0]
                      ?.replace('\n', '')
                      .replace(/&nbsp;/g, ' ')

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
                  <Form className={s.form}>
                    <ScrollToFieldError />
                    <div className={cn(s.formBlock, s.padding)}>
                      {!isLoading &&
                        state.paymentListLoaded &&
                        paymentsMethodList?.length === 0 && (
                          <div className={s.notAllowPayMethod}>
                            {t('order_amount_is_less')}
                          </div>
                        )}
                      {paymentsMethodList?.length > 0 && !state.isPhoneVerification && (
                        <>
                          <div className={s.formBlockTitle}>{t('Payment method')}:</div>
                          <div className={s.formFieldsBlock} name="selectedPayMethod´">
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
                                            {Number(balance).toFixed(2)} EUR
                                          </span>
                                        </>
                                      )}
                                    </span>
                                  </div>
                                  {paymethod?.$ === '71' && (
                                    <HintWrapper
                                      popupClassName={s.cardHintWrapper}
                                      label={t('Paypalich description', {
                                        ns: 'other',
                                      })}
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
                              onlyCountries={renderPhoneList(
                                filteredPayment_method?.$key,
                              )}
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
                    <div
                      className={cn(s.padding, s.payersList, {
                        [s.hide]:
                          (values?.selectedPayMethod?.name?.$?.includes('balance') &&
                            values?.selectedPayMethod?.paymethod_type?.$ === '0') ||
                          !values?.selectedPayMethod,
                      })}
                    >
                      <PayersList renderTitle={renderPayersListTitle} />
                    </div>

                    {values?.selectedPayMethod &&
                      values?.selectedPayMethod?.payment_minamount && (
                        <div
                          className={cn(s.infotext, s.padding, {
                            [s.showMore]: state.showMore,
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
                        onClick={() => setState({ showMore: !state.showMore })}
                        className={cn(s.readMore, s.padding)}
                      >
                        {t(state.showMore ? 'Collapse' : 'Read more', {
                          ns: 'user_settings',
                        })}
                      </button>
                    )}

                    {!state.isPhoneVerification && (
                      <div className={cn(s.formBlock, s.promocodeBlock, s.padding)}>
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
                            disabled={values?.promocode?.length === 0}
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
                    {VDS_FEE_AMOUNT && VDS_FEE_AMOUNT > 0 ? (
                      <div className={cn(s.padding, s.penalty_sum)}>
                        {t('Late fee')}: <b>{VDS_FEE_AMOUNT.toFixed(4)} EUR</b>
                      </div>
                    ) : (
                      ''
                    )}
                    <div className={s.padding}>
                      <div className={s.totalSum}>
                        <span>
                          {state.cartData?.full_discount &&
                          Number(state.cartData?.full_discount) !== 0 ? (
                            <>
                              {t('Saving')}: <b>{state.cartData?.full_discount} EUR</b>
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
                            {t('Tax')}:<b>{state.cartData?.tax} EUR</b>
                          </div>
                        ) : null}
                        <div className={s.priceBlock}>
                          {t('Total')}
                          {Number(state.cartData?.tax) > 0 &&
                            ' (' + t('Tax included').toLocaleLowerCase() + ')'}
                          : <b>{state.cartData?.total_sum} EUR</b>
                        </div>
                      </div>

                      {!state.isPhoneVerification && (
                        <div className={s.offerBlock}>
                          <CheckBox
                            value={values[OFFER_FIELD] || false}
                            onClick={() =>
                              setState({ isPolicyChecked: !state.isPolicyChecked })
                            }
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
                      )}

                      {state.isPhoneVerification && (
                        <div className={s.phoneVerificationBlock}>
                          <Icon name="Attention" />
                          <span>
                            {t('verification_required_purchase', { ns: 'billing' })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={s.btnBlock}>
                      {state.isPhoneVerification ? (
                        <Button
                          className={s.saveBtn}
                          isShadow
                          size="large"
                          label={t('Verify number', { ns: 'user_settings' })}
                          type="button"
                          onClick={hideBasketHandler}
                        />
                      ) : (
                        <>
                          {paymentsMethodList?.length === 0 ? (
                            <Button
                              className={s.saveBtn}
                              isShadow
                              size="medium"
                              label={t('OK', { ns: 'billing' })}
                              type="button"
                              onClick={() => {
                                navigate(routes.BILLING, {
                                  replace: true,
                                })
                                closeBasketHamdler(state.cartData?.billorder)
                              }}
                            />
                          ) : (
                            <Button
                              className={s.saveBtn}
                              isShadow
                              size="medium"
                              label={t('Pay', { ns: 'billing' })}
                              type="submit"
                            />
                          )}
                        </>
                      )}
                      <button
                        onClick={() => setState({ isClosing: true })}
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
              onClick={() => closeBasketHamdler(state.cartData?.billorder)}
              className={s.saveBtn}
              isShadow
              size="medium"
              label={t('OK')}
              type="button"
            />
            <button
              onClick={() => setState({ isClosing: false })}
              type="button"
              className={s.close}
            >
              {t('Cancel', { ns: 'other' })}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
