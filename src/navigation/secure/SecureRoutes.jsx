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
  selectors,
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
  CloudVPSPageLazy,
  CloudVPSInstancesPageLazy,
  CloudVPSSSHKeysPageLazy,
  CreateInstancePageLazy,
  CloudInstanceItemPageLazy,
  InstanceDetailsOverviewLazy,
  InstanceMetricsLazy,
  InstanceNetworkTrafficLazy,
  InstanceSnapshotsLazy,
} from './LazyRoutes'
import s from './SecurePage.module.scss'
import BlockingModal from '@src/Components/BlockingModal/BlockingModal'
import { FIRST_MONTH_HOSTING_DISCOUNT_ID } from '@utils/constants'
import { navigateIfFromSite } from '@utils'

const Component = ({ fromPromotionLink }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartState = useSelector(cartSelectors.getCartState)
  const promotionsList = useSelector(selectors.getPromotionsList)
  const paymentsList = useSelector(billingSelectors.getPaymentsReadOnlyList)
  const isModalCreatePaymentOpened = useSelector(
    billingSelectors.getIsModalCreatePaymentOpened,
  )

  const [isShowPromotion, setIsShowPromotion] = useState(false)
  const [promotionType, setPromotionType] = useState(false)
  const [isUserClosedBanner, setIsUserClosedBanner] = useState(false)

  useEffect(() => {
    dispatch(cartOperations.getSalesList())
    dispatch(billingOperations.setPaymentsFilters({ status: '4' }, true))
    dispatch(billingOperations.checkIsStripeAvailable())
    const isBannerClosed = localStorage.getItem('isBannerClosed')
    setIsUserClosedBanner(!!isBannerClosed)
  }, [])

  /**
   * This useEffect manages hosting promo banner for promotion "1 month of hosting for free"
   */
  useEffect(() => {
    if (isUserClosedBanner) return

    let isPromotionActive

    /**
     * This is for a new version of API
     */
    if (promotionsList?.[0]?.products) {
      isPromotionActive = promotionsList?.some(
        el => el.id?.$ === FIRST_MONTH_HOSTING_DISCOUNT_ID,
      )

      /**
       * This is for an old version of API and should be deleted after API update
       */
    } else {
      isPromotionActive = promotionsList?.some(
        el => el?.promotion?.$ === '1month-hosting',
      )
    }

    if (
      !isPromotionActive &&
      paymentsList?.length &&
      promotionsList &&
      fromPromotionLink
    ) {
      setPromotionType('third')
      setIsShowPromotion(true)
      return
    }

    if (paymentsList?.length && isPromotionActive) {
      setPromotionType('second')
      setIsShowPromotion(true)
    }

    if (paymentsList && !paymentsList?.length && promotionsList) {
      setPromotionType('first')
      setIsShowPromotion(true)
    }
  }, [promotionsList, paymentsList])

  /**
   * navigates to specific service order page if we have info in localStorage
   */
  useEffect(() => {
    const cartDataFromSite = localStorage.getItem('site_cart')
    if (cartDataFromSite) {
      navigateIfFromSite(cartDataFromSite, navigate)
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

  if (location.pathname === route.CHANGE_PASSWORD) {
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
      {isShowPromotion && promotionType && location.pathname === route.SHARED_HOSTING && (
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

          <Route path={route.CLOUD_VPS} element={<CloudVPSPageLazy />}>
            <Route index element={<CloudVPSInstancesPageLazy />} />
            <Route path="ssh_keys" element={<CloudVPSSSHKeysPageLazy />} />
          </Route>

          <Route
            path={route.CLOUD_VPS_CREATE_INSTANCE}
            element={<CreateInstancePageLazy />}
          />

          <Route path={`${route.CLOUD_VPS}/:id`} element={<CloudInstanceItemPageLazy />}>
            <Route index element={<InstanceDetailsOverviewLazy />} />
            <Route path="metrics" element={<InstanceMetricsLazy />} />
            <Route path="network_traffic" element={<InstanceNetworkTrafficLazy />} />
            <Route path="snapshots" element={<InstanceSnapshotsLazy />} />
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
