import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Cart,
  Container,
  EmailConfirmation,
  Portal,
  CartFromSite,
  EmailTrigger,
  MainEmailConfirmation,
} from '@components'
import { cartSelectors } from '@redux'
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
} from './LazyRoutes'

const Component = () => {
  const navigate = useNavigate()

  const cartState = useSelector(cartSelectors?.getCartIsOpened)

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')
    if (cartFromSite) {
      const funcName = JSON.parse(cartFromSite)?.func
      if (funcName === 'vds.order.param') {
        return navigate(route.VPS_ORDER)
      } else if (funcName === 'domain.order.name') {
        return navigate(route.DOMAINS_ORDERS)
      } else if (funcName === 'vhost.order.param') {
        return navigate(route.SHARED_HOSTING_ORDER)
      } else if (funcName === 'forexbox.order.param') {
        return navigate(route.FOREX_ORDER)
      } else if (funcName === 'storage.order.param') {
        return navigate(route.FTP_ORDER)
      } else if (funcName === 'dedic.order.param') {
        return navigate(route.DEDICATED_SERVERS_ORDER)
      }
    }
  }, [])

  if (location.pathname === route.VDS) {
    return <Navigate to={route.VPS} />
  }

  if (location.pathname === route.VDS_ORDER) {
    return <Navigate to={route.VPS_ORDER} />
  }

  if (location.pathname === route.VDS_IP) {
    return <Navigate to={route.VPS_IP} />
  }

  return (
    <Container>
      <EmailTrigger />
      <Routes>
        <Route path={route.HOME} element={<Navigate to={route.SERVICES} replace={true} />} />
        <Route path={route.SERVICES} element={<ServicesPageLazy />} />
        <Route path={route.VPS} element={<VDSPageLazy />} />
        <Route path={route.VPS_ORDER} element={<VDSOrderLazy />} />
        <Route path={route.VPS_IP} element={<VDSipLazy />} />
        <Route path={route.SHARED_HOSTING} element={<SharedHostingLazy />} />
        <Route path={route.SHARED_HOSTING_ORDER} element={<SharedHostingOrderLazy />} />
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
        <Route path={route.DEDICATED_SERVERS} element={<DedicatedServersPageLazy />} />
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

        <Route path={route.PAYERS} element={<PayersPageLazy />} />
        <Route path={route.CONTRACTS} element={<ContractsPageLazy />} />
        <Route path={route.USER_SETTINGS} element={<UserSettingsPageLazy />}>
          <Route path=":path/" element={<UserSettingsPageLazy />} />
        </Route>

        <Route path={route.PHONE_VERIFICATION} element={<PhoneVerificationPageLazy />} />

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

        <Route path={route.PAYMENT_PROCESSING} element={<PaymentProcessingPageLazy />} />

        <Route path="*" element={<ErrorPageLazy />} />
      </Routes>

      {cartState?.isOpened && (
        <Portal>
          <Cart />
        </Portal>
      )}
    </Container>
  )
}

const SupportScreen = () => {
  const location = useLocation()

  if (location.pathname === route.SUPPORT) {
    return <Navigate to={`${route.SUPPORT}/requests`} />
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
    return <Navigate to={`${route.BILLING}/payments`} />
  }

  return (
    <Routes>
      <Route path=":path/*" element={<BillingPageLazy />} />
      <Route path=":path/:result" element={<BillingPageLazy />} />
    </Routes>
  )
}

export default Component
