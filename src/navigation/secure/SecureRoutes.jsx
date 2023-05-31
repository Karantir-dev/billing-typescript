import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Cart,
  Container,
  EmailConfirmation,
  Portal,
  TrustedUsers,
  CartFromSite,
  PageTitleRender,
  EmailTrigger,
  MainEmailConfirmation,
} from '@components'
import { useTranslation } from 'react-i18next'
import {
  AccessLogPage,
  AffiliateProgram,
  BillingPage,
  ErrorPage,
  OpenedTicker,
  PayersPage,
  SupportPage,
  UserSettings,
  Contracts,
  DedicIPpage,
  DedicatedServersPage,
  DedicOrderPage,
  FTP,
  FTPOrder,
  DNS,
  DNSOrder,
  ForexPage,
  ForexOrderPage,
  PhoneVerificationPage,
  PaymentSaved,
  SocialNetAdd,
} from '@pages'
import { cartSelectors } from '@redux'
import * as route from '../../routes'
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
} from './LazyRoutes'

const Component = () => {
  const navigate = useNavigate()

  const { t } = useTranslation([
    'container',
    'vds',
    'crumbs',
    'virtual_hosting',
    'domains',
    'dedicated_servers',
    'access_log',
    'payers',
    'trusted_users',
  ])
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
        <Route
          path={route.DEDICATED_SERVERS}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t(
                'burger_menu.services.services_list.dedicated_servers',
              )}`}
            >
              <DedicatedServersPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DEDICATED_SERVERS_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('page_title', {
                ns: 'dedicated_servers',
              })}`}
            >
              <DedicOrderPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DEDICATED_SERVERS_IP}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('ip', { ns: 'crumbs' })}`}
            >
              <DedicIPpage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.FTP}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t(
                'burger_menu.services.services_list.external_ftp',
              )}`}
            >
              <FTP />
            </PageTitleRender>
          }
        />
        <Route
          path={route.FTP_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('ftp_order', { ns: 'crumbs' })}`}
            >
              <FTPOrder />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DNS}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t(
                'burger_menu.services.services_list.dns_hosting',
              )}`}
            >
              <DNS />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DNS_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('dns_order', { ns: 'crumbs' })}`}
            >
              <DNSOrder />
            </PageTitleRender>
          }
        />
        <Route
          path={route.FOREX}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('forex', { ns: 'crumbs' })}`}
            >
              <ForexPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.FOREX_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('forex_order', { ns: 'crumbs' })}`}
            >
              <ForexOrderPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.ACCESS_LOG}
          element={
            <PageTitleRender title={t('access_log', { ns: 'access_log' })}>
              <AccessLogPage />
            </PageTitleRender>
          }
        />
        <Route path={`${route.SUPPORT}/*`} element={<SupportScreen />} />
        <Route path={`${route.BILLING}/*`} element={<BillingScreen />} />
        <Route
          path={route.PAYERS}
          element={
            <PageTitleRender title={t('Payers', { ns: 'payers' })}>
              <PayersPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.CONTRACTS}
          element={
            <PageTitleRender title={t('profile.contracts')}>
              <Contracts />
            </PageTitleRender>
          }
        />
        <Route path={route.USER_SETTINGS} element={<UserSettings />}>
          <Route path=":path/" element={<UserSettings />} />
        </Route>

        <Route path={route.PHONE_VERIFICATION} element={<PhoneVerificationPage />} />

        <Route path={route.SOC_NET_AUTH} element={<SocialNetAdd />} />
        <Route path={`${route.AFFILIATE_PROGRAM}/*`} element={<AffiliateProgram />} />
        <Route
          path={route.TRUSTED_USERS}
          element={
            <PageTitleRender title={t('trusted_users.title', { ns: 'trusted_users' })}>
              <TrustedUsers />
            </PageTitleRender>
          }
        />
        <Route path={route.CONFIRM_EMAIL} element={<EmailConfirmation />} />
        <Route path={`${route.ERROR_PAGE}/*`} element={<ErrorPage />} />

        <Route path={route.SITE_CART} element={<CartFromSite isAuth />} />

        <Route path={route.CONFIRM_MAIN_EMAIL} element={<MainEmailConfirmation />} />
        <Route
          path={route.PAYMENT_SAVED}
          element={
            <PageTitleRender title={'payment method saved'}>
              <PaymentSaved />
            </PageTitleRender>
          }
        />

        <Route path="*" element={<Navigate replace to={route.SERVICES} />} />
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

  const { t } = useTranslation(['support'])

  if (location.pathname === route.SUPPORT) {
    return <Navigate to={`${route.SUPPORT}/requests`} />
  }

  return (
    <Routes>
      <Route
        path=":path/*"
        element={
          <PageTitleRender title={t('support')}>
            <SupportPage />
          </PageTitleRender>
        }
      />
      <Route
        path=":path/:id"
        element={
          <PageTitleRender title={t('support') + '/' + t('Message')}>
            <OpenedTicker />
          </PageTitleRender>
        }
      />
    </Routes>
  )
}

const BillingScreen = () => {
  const location = useLocation()

  const { t } = useTranslation(['billing'])

  if (location.pathname === route.BILLING) {
    return <Navigate to={`${route.BILLING}/payments`} />
  }

  return (
    <Routes>
      <Route
        path=":path/*"
        element={
          <PageTitleRender title={t('Finance')}>
            <BillingPage />
          </PageTitleRender>
        }
      />
      <Route
        path=":path/:result"
        element={
          <PageTitleRender title={t('Finance')}>
            <BillingPage />
          </PageTitleRender>
        }
      />
    </Routes>
  )
}

export default Component
