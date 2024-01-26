import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AuthPage } from '@pages'
import {
  Cart,
  Container,
  EmailConfirmation,
  PasswordChange,
  Portal,
  CartFromSite,
  EmailTrigger,
  UpdateService,
  MainEmailConfirmation,
  PromotionBanner,
  SuccessPayment,
  ErrorPayment,
  ModalCreatePayment,
} from '@components'
import {
  cartSelectors,
  cartOperations,
  billingSelectors,
  billingOperations,
} from '@redux'
import * as route from '@src/routes'
import {
  ServicesPageLazy,
  VDSPageLazy,
  VDSOrderLazy,
  VDSipLazy,
  SharedHostingLazy,
  SharedHostingOrderLazy,
  SiteCareLazy,
  SiteCareOrderLazy,
  VPNLazy,
  VPNOrderLazy,
  DomainsPageLazy,
  DomainOrderPageLazy,
  DomainContactInfoPageLazy,
  DomainsNsPageLazy,
  DedicatedServersPageLazy,
  DedicOrderPageLazy,
  DedicIPpageLazy,
  FTPPageLazy,
  FTPOrderPageLazy,
  DNSPageLazy,
  DNSOrderPageLazy,
  ForexPageLazy,
  ForexOrderPageLazy,
  AccessLogPageLazy,
  PayersPageLazy,
  ContractsPageLazy,
  UserSettingsPageLazy,
  PhoneVerificationPageLazy,
  SocialNetAddPageLazy,
  AffiliateProgramPageLazy,
  TrustedUsersPageLazy,
  ErrorPageLazy,
  PaymentSavedPageLazy,
  SupportPageLazy,
  OpenedTickerPageLazy,
  BillingPageLazy,
  PaymentProcessingPageLazy,
  DedicatedPageLazy,
  CloneOrderPageLazy,
} from './LazyRoutes'
import s from './SecurePage.module.scss'
import BlockingModal from '@src/Components/BlockingModal/BlockingModal'

const Component = ({ fromPromotionLink }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartState = useSelector(cartSelectors?.getCartIsOpened)
  const [isShowPromotion, setIsShowPromotion] = useState(false)
  const [salesList, setSalesList] = useState()
  const [promotionType, setPromotionType] = useState(false)
  const [isUserClosedBanner, setIsUserClosedBanner] = useState(false)

  const paymentsList = useSelector(billingSelectors.getPaymentsReadOnlyList)
  const isModalCreatePaymentOpened = useSelector(
    billingSelectors.getIsModalCreatePaymentOpened,
  )

  useEffect(() => {
    dispatch(cartOperations.getSalesList(setSalesList))
    dispatch(billingOperations.setPaymentsFilters({ status: '4' }, true))
    dispatch(billingOperations.checkIsStripeAvailable())
    const isBannerClosed = localStorage.getItem('isBannerClosed')
    setIsUserClosedBanner(!!isBannerClosed)
  }, [])

  useEffect(() => {
    if (isUserClosedBanner) return

    const isPromotionActive = salesList?.some(el => {
      return el?.promotion?.$ === '1month-hosting'
    })

    if (!isPromotionActive && paymentsList?.length && salesList && fromPromotionLink) {
      setPromotionType('third')
      setIsShowPromotion(true)
      return
    }

    if (paymentsList?.length && isPromotionActive && salesList) {
      setPromotionType('second')
      setIsShowPromotion(true)
    }

    if (paymentsList && !paymentsList?.length && salesList) {
      setPromotionType('first')
      setIsShowPromotion(true)
    }
  }, [salesList, paymentsList])

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')
    if (cartFromSite) {
      const funcName = JSON.parse(cartFromSite)?.func
      if (funcName === 'vds.order.param') {
        return navigate(route.VPS_ORDER, {
          replace: true,
        })
      } else if (funcName === 'domain.order.name') {
        return navigate(route.DOMAINS_ORDERS, {
          replace: true,
        })
      } else if (funcName === 'vhost.order.param') {
        return navigate(route.SHARED_HOSTING_ORDER, {
          replace: true,
        })
      } else if (funcName === 'wordpress.order.param') {
        return navigate(route.WORDPRESS_ORDER, {
          replace: true,
        })
      } else if (funcName === 'forexbox.order.param') {
        return navigate(route.FOREX_ORDER, {
          replace: true,
        })
      } else if (funcName === 'storage.order.param') {
        return navigate(route.FTP_ORDER, {
          replace: true,
        })
      } else if (funcName === 'dedic.order.param') {
        return navigate(route.DEDICATED_SERVERS_ORDER, {
          replace: true,
        })
      }
    }
  }, [])

  if (location.pathname === route.VDS) {
    return <Navigate to={route.VPS} replace />
  }

  if (location.pathname === route.VDS_ORDER) {
    return <Navigate to={route.VPS_ORDER} replace />
  }

  if (location.pathname === route.VDS_IP) {
    return <Navigate to={route.VPS_IP} replace />
  }

  if (location.pathname.includes(route.CHANGE_PASSWORD)) {
    return (
      <Routes>
        <Route
          path={route.CHANGE_PASSWORD}
          element={<AuthPage children={<PasswordChange />} />}
        />
      </Routes>
    )
  }

  const closePromotionBanner = () => setIsShowPromotion(false)

  return (
    <Container>
      {isShowPromotion && promotionType && (
        <PromotionBanner type={promotionType} closeBanner={closePromotionBanner} />
      )}
      <UpdateService />
      <EmailTrigger />
      <div className={s.page}>
        <Routes>
          <Route
            path={route.HOME}
            element={<Navigate to={route.SERVICES} replace={true} />}
          />
          <Route
            path={route.LOGIN}
            element={<Navigate to={route.SERVICES} replace={true} />}
          />
          <Route
            path={route.REGISTRATION}
            element={<Navigate to={route.SERVICES} replace={true} />}
          />
          <Route path={route.SERVICES} element={<ServicesPageLazy />} />
          <Route path={route.VPS} element={<VDSPageLazy />} />
          <Route path={route.VPS_ORDER} element={<VDSOrderLazy />} />
          <Route path={route.VPS_IP} element={<VDSipLazy />} />
          <Route path={route.SHARED_HOSTING} element={<SharedHostingLazy />} />
          <Route path={route.SHARED_HOSTING_ORDER} element={<SharedHostingOrderLazy />} />
          <Route
            path={route.WORDPRESS}
            element={<SharedHostingLazy type="wordpress" />}
          />
          <Route
            path={route.WORDPRESS_ORDER}
            element={<SharedHostingOrderLazy type="wordpress" />}
          />
          <Route path={route.SITE_CARE} element={<SiteCareLazy />} />
          <Route path={route.SITE_CARE_ORDER} element={<SiteCareOrderLazy />} />
          <Route path={route.VPN} element={<VPNLazy />} />
          <Route path={route.VPN_ORDER} element={<VPNOrderLazy />} />
          <Route path={route.DOMAINS} element={<DomainsPageLazy />} />
          <Route path={route.DOMAINS_ORDERS} element={<DomainOrderPageLazy />} />
          <Route
            path={route.DOMAINS_CONTACT_INFO}
            element={<DomainContactInfoPageLazy />}
          />
          <Route path={route.DOMAINS_NS} element={<DomainsNsPageLazy />} />
          <Route
            path={route.DOMAINS_TRANSFER_ORDERS}
            element={<DomainOrderPageLazy transfer={true} />}
          />
          <Route
            path={route.DOMAINS_TRANSFER_CONTACT_INFO}
            element={<DomainContactInfoPageLazy transfer={true} />}
          />
          <Route
            path={route.DOMAINS_TRANSFER_NS}
            element={<DomainsNsPageLazy transfer={true} />}
          />
          <Route path={`${route.DEDICATED_SERVERS}`} element={<DedicatedPageLazy />}>
            <Route index element={<DedicatedServersPageLazy />} />
            <Route path="vds" element={<VDSPageLazy isDedic />} />
          </Route>
          <Route path={route.DEDICATED_SERVERS_ORDER} element={<DedicOrderPageLazy />} />
          <Route path={route.DEDICATED_SERVERS_IP} element={<DedicIPpageLazy />} />
          <Route path={route.FTP} element={<FTPPageLazy />} />
          <Route path={route.FTP_ORDER} element={<FTPOrderPageLazy />} />
          <Route path={route.DNS} element={<DNSPageLazy />} />
          <Route path={route.DNS_ORDER} element={<DNSOrderPageLazy />} />
          <Route path={route.FOREX} element={<ForexPageLazy />} />
          <Route path={route.FOREX_ORDER} element={<ForexOrderPageLazy />} />
          <Route path={route.ACCESS_LOG} element={<AccessLogPageLazy />} />
          <Route path={`${route.SUPPORT}/*`} element={<SupportScreen />} />
          <Route path={`${route.BILLING}/*`} element={<BillingScreen />} />

          <Route path={route.SUCCESS_PAYMENT} element={<SuccessPayment />} />
          <Route path={route.FAILED_PAYMENT} element={<ErrorPayment />} />

          <Route path={route.PAYERS} element={<PayersPageLazy />} />
          <Route path={route.CONTRACTS} element={<ContractsPageLazy />} />
          <Route path={route.USER_SETTINGS} element={<UserSettingsPageLazy />}>
            <Route path=":path/" element={<UserSettingsPageLazy />} />
          </Route>

          <Route
            path={route.PHONE_VERIFICATION}
            element={<PhoneVerificationPageLazy />}
          />

          <Route path={route.SOC_NET_AUTH} element={<SocialNetAddPageLazy />} />
          <Route
            path={`${route.AFFILIATE_PROGRAM}/*`}
            element={<AffiliateProgramPageLazy />}
          />
          <Route path={route.TRUSTED_USERS} element={<TrustedUsersPageLazy />} />

          <Route path={`${route.ERROR_PAGE}/*`} element={<ErrorPageLazy />} />

          <Route path={route.CONFIRM_EMAIL} element={<EmailConfirmation />} />
          <Route path={route.SITE_CART} element={<CartFromSite isAuth />} />
          <Route path={route.CONFIRM_MAIN_EMAIL} element={<MainEmailConfirmation />} />

          <Route path={route.PAYMENT_SAVED} element={<PaymentSavedPageLazy />} />

          <Route
            path={route.PAYMENT_PROCESSING}
            element={<PaymentProcessingPageLazy />}
          />

          <Route path={route.ORDER} element={<CloneOrderPageLazy />} />

          <Route path="*" element={<ErrorPageLazy />} />
        </Routes>
      </div>

      {isModalCreatePaymentOpened && <ModalCreatePayment />}

      {cartState?.isOpened && (
        <Portal>
          <Cart />
        </Portal>
      )}
      <BlockingModal />
    </Container>
  )
}

const SupportScreen = () => {
  const location = useLocation()

  if (location.pathname === route.SUPPORT) {
    return <Navigate to={`${route.SUPPORT}/requests`} replace />
  }

  return (
    <Routes>
      <Route path=":path/*" element={<SupportPageLazy />} />
      <Route path=":path/:id" element={<OpenedTickerPageLazy />} />
    </Routes>
  )
}

const BillingScreen = () => {
  const location = useLocation()

  if (location.pathname === route.BILLING) {
    return <Navigate to={`${route.BILLING}/payments`} replace />
  }

  return (
    <Routes>
      <Route path=":path" element={<BillingPageLazy />} />
      <Route path="*" element={<ErrorPageLazy />} />
    </Routes>
  )
}

export default Component
