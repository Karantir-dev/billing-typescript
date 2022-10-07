import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Cart,
  Container,
  EmailConfirmation,
  Portal,
  PrivateRoute,
  ServicesList,
  TrustedUsers,
  CartFromSite,
  PageTitleRender,
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
        return navigate(route.VDS_ORDER)
      } else if (funcName === 'domain.order.name') {
        return navigate(route.DOMAINS_ORDERS)
      }
    }
  }, [])

  return (
    <Container>
      <Routes>
        <Route
          path={route.SERVICES}
          element={
            <PageTitleRender title={t('aside_menu.services')}>
              <PrivateRoute
                children={<ServicesPage children={<ServicesList />} />}
                redirectTo={route.LOGIN}
              />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VDS}
          element={
            <PageTitleRender title={`${t('aside_menu.services')}/VDS `}>
              <PrivateRoute redirectTo={route.LOGIN} children={<VDS />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VDS_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('vds_order', { ns: 'crumbs' })} `}
            >
              <PrivateRoute redirectTo={route.LOGIN} children={<VDSOrder />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VDS_IP}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/VDS ${t('ip_address', { ns: 'vds' })}`}
            >
              <PrivateRoute redirectTo={route.LOGIN} children={<VDSip />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<SharedHosting />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<SharedHostingOrder />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<SiteCare />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<SiteCareOrder />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.VPN}
          element={
            <PageTitleRender title={`${t('aside_menu.services')}/${t('VPN')}`}>
              <PrivateRoute redirectTo={route.LOGIN} children={<VPN />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<VpnOrder />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<DomainsPage />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<DomainOrderPage />} />
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
              <PrivateRoute
                redirectTo={route.LOGIN}
                children={<DomainContactInfoPage />}
              />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<DomainsNsPage />} />
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
              <PrivateRoute
                redirectTo={route.LOGIN}
                children={<DomainOrderPage transfer />}
              />
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
              <PrivateRoute
                redirectTo={route.LOGIN}
                children={<DomainContactInfoPage transfer />}
              />
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
              <PrivateRoute
                redirectTo={route.LOGIN}
                children={<DomainsNsPage transfer />}
              />
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
              <PrivateRoute
                redirectTo={route.LOGIN}
                children={<DedicatedServersPage />}
              />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<DedicOrderPage />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DEDICATED_SERVERS_IP}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('ip', { ns: 'crumbs' })}`}
            >
              <PrivateRoute redirectTo={route.LOGIN} children={<DedicIPpage />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<FTP />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.FTP_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('ftp_order', { ns: 'crumbs' })}`}
            >
              <PrivateRoute redirectTo={route.LOGIN} children={<FTPOrder />} />
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
              <PrivateRoute redirectTo={route.LOGIN} children={<DNS />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.DNS_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('dns_order', { ns: 'crumbs' })}`}
            >
              <PrivateRoute redirectTo={route.LOGIN} children={<DNSOrder />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.FOREX}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('forex', { ns: 'crumbs' })}`}
            >
              <PrivateRoute redirectTo={route.LOGIN} children={<ForexPage />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.FOREX_ORDER}
          element={
            <PageTitleRender
              title={`${t('aside_menu.services')}/${t('forex_order', { ns: 'crumbs' })}`}
            >
              <PrivateRoute redirectTo={route.LOGIN} children={<ForexOrderPage />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.ACCESS_LOG}
          element={
            <PageTitleRender title={t('access_log', { ns: 'access_log' })}>
              <PrivateRoute redirectTo={route.LOGIN} children={<AccessLogPage />} />
            </PageTitleRender>
          }
        />
        <Route
          path={`${route.SUPPORT}/*`}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<SupportScreen />} />}
        />
        <Route
          path={`${route.BILLING}/*`}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<BillingScreen />} />}
        />
        <Route
          path={route.PAYERS}
          element={
            <PageTitleRender title={t('Payers', { ns: 'payers' })}>
              <PrivateRoute redirectTo={route.LOGIN} children={<PayersPage />} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.CONTRACTS}
          element={
            <PageTitleRender title={t('profile.contracts')}>
              <PrivateRoute children={<Contracts />} redirectTo={route.LOGIN} />
            </PageTitleRender>
          }
        />
        <Route
          path={`${route.USER_SETTINGS}`}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<UserSettings />} />}
        >
          <Route
            path=":path/"
            element={
              <PrivateRoute redirectTo={route.LOGIN} children={<UserSettings />} />
            }
          />
        </Route>
        <Route
          path={route.SOC_NET_AUTH}
          element={
            <PrivateRoute
              children={<SocialNetAdd />}
              restricted
              redirectTo={route.SERVICES}
            />
          }
        />
        <Route
          path={`${route.AFFILIATE_PROGRAM}/*`}
          element={
            <PrivateRoute children={<AffiliateProgram />} redirectTo={route.LOGIN} />
          }
        />
        <Route
          path={route.TRUSTED_USERS}
          element={
            <PageTitleRender title={t('trusted_users.title', { ns: 'trusted_users' })}>
              <PrivateRoute children={<TrustedUsers />} redirectTo={route.LOGIN} />
            </PageTitleRender>
          }
        />
        <Route
          path={route.CONFIRM_EMAIL}
          element={
            <PrivateRoute children={<EmailConfirmation />} redirectTo={route.LOGIN} />
          }
        />
        <Route
          path={`${route.ERROR_PAGE}/*`}
          element={<PrivateRoute children={<ErrorPage />} redirectTo={route.LOGIN} />}
        />

        <Route
          path={route.SITE_CART}
          element={
            <PrivateRoute
              children={<CartFromSite isAuth />}
              restricted
              redirectTo={route.LOGIN}
            />
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
            <PrivateRoute redirectTo={route.LOGIN} children={<SupportPage />} />
          </PageTitleRender>
        }
      />
      <Route
        path=":path/:id"
        element={
          <PrivateRoute
            redirectTo={route.LOGIN}
            children={
              <PageTitleRender title={t('support') + '/' + t('Message')}>
                <OpenedTicker />
              </PageTitleRender>
            }
          />
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
            <PrivateRoute redirectTo={route.LOGIN} children={<BillingPage />} />
          </PageTitleRender>
        }
      />
      <Route
        path=":path/:result"
        element={
          <PageTitleRender title={t('Finance')}>
            <PrivateRoute redirectTo={route.LOGIN} children={<BillingPage />} />
          </PageTitleRender>
        }
      />
    </Routes>
  )
}

export default Component
