import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Cart,
  Container,
  EmailConfirmation,
  Portal,
  ServicesList,
  TrustedUsers,
  CartFromSite,
  PageTitleRender,
  EmailTrigger,
  MainEmailConfirmation,
} from '../../Components'
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
  DomainsPage,
  DomainOrderPage,
  ServicesPage,
  Contracts,
  DomainContactInfoPage,
  DomainsNsPage,
  DedicIPpage,
  VDSip,
  DedicatedServersPage,
  DedicOrderPage,
  FTP,
  FTPOrder,
  DNS,
  DNSOrder,
  VDS,
  VDSOrder,
  SharedHosting,
  SharedHostingOrder,
  ForexPage,
  ForexOrderPage,
  SiteCare,
  SiteCareOrder,
  VPN,
  VpnOrder,
  PhoneVerificationPage,
  PaymentSaved
} from '../../Pages'
import SocialNetAdd from '../../Pages/UserSettings/SocialNetAdd/SocialNetAdd'
import { cartSelectors } from '../../Redux'
import * as route from '../../routes'

// const AffiliateProgram = React.lazy(() =>
//   import(
//     '../../Pages/AffiliateProgram/AffiliateProgram' /* webpakChankName: "AffiliateProgram" */
//   ),
// )

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
        <Route
          path={route.SERVICES}
          element={
            <PageTitleRender title={t('aside_menu.services')}>
              <ServicesPage children={<ServicesList />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VPS}
          element={
            <PageTitleRender title={`${t('aside_menu.services')}/VDS `}>
              <VDS />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VPS_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('vds_order', { ns: 'crumbs' })} `}
            >
              <VDSOrder />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VPS_IP}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/VDS ${t('ip_address', { ns: 'vds' })}`}
            >
              <VDSip />
            </PageTitleRender>
          }
        />
        <Route
          path={route.SHARED_HOSTING}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t(
                'burger_menu.services.services_list.virtual_hosting',
              )}`}
            >
              <SharedHosting />
            </PageTitleRender>
          }
        />
        <Route
          path={route.SHARED_HOSTING_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('Virtual hosting order', {
                ns: 'virtual_hosting',
              })}`}
            >
              <SharedHostingOrder />
            </PageTitleRender>
          }
        />
        <Route
          path={route.SITE_CARE}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t(
                'burger_menu.services.services_list.wetsite_care',
              )}`}
            >
              <SiteCare />
            </PageTitleRender>
          }
        />
        <Route
          path={route.SITE_CARE_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('Website care order', {
                ns: 'virtual_hosting',
              })}`}
            >
              <SiteCareOrder />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VPN}
          element={
            <PageTitleRender title={`${t('aside_menu.services')}/${t('VPN')}`}>
              <VPN />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VPN_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('vpn_order', {
                ns: 'crumbs',
              })}`}
            >
              <VpnOrder />
            </PageTitleRender>
          }
        />

        <Route
          path={route.DOMAINS}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t(
                'burger_menu.services.services_list.domains',
              )}`}
            >
              <DomainsPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DOMAINS_ORDERS}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('Domain name order', {
                ns: 'domains',
              })}`}
            >
              <DomainOrderPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DOMAINS_CONTACT_INFO}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('Domain name order', {
                ns: 'domains',
              })}/${t('Owner contacts', {
                ns: 'domains',
              })}`}
            >
              <DomainContactInfoPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DOMAINS_NS}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('Domain name order', {
                ns: 'domains',
              })}/${t('Owner contacts', {
                ns: 'domains',
              })}/${t('Service parameters', {
                ns: 'domains',
              })}`}
            >
              <DomainsNsPage />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DOMAINS_TRANSFER_ORDERS}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('Domain name transfer', {
                ns: 'domains',
              })}`}
            >
              <DomainOrderPage transfer />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DOMAINS_TRANSFER_CONTACT_INFO}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('Domain name transfer', {
                ns: 'domains',
              })}/${t('Owner contacts', {
                ns: 'domains',
              })}`}
            >
              <DomainContactInfoPage transfer />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DOMAINS_TRANSFER_NS}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('Domain name transfer', {
                ns: 'domains',
              })}/${t('Owner contacts', {
                ns: 'domains',
              })}/${t('Service parameters', {
                ns: 'domains',
              })}`}
            >
              <DomainsNsPage transfer />
            </PageTitleRender>
          }
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
