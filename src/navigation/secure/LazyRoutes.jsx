import { Suspense, lazy } from 'react'
import { PageTitleRender, ServicesList, Loader } from '@components'
import { useTranslation } from 'react-i18next'

const ServicesPage = lazy(() =>
  import(/* webpackChunkName: "ServicesPage" */ '@pages/ServicesPage/ServicesPage'),
)

const VDS = lazy(() =>
  import(/* webpackChunkName: "VDSPage" */ '@pages/ServicesPage/VDS/VDSPage/VDS'),
)
const VDSOrder = lazy(() =>
  import(/* webpackChunkName: "VDSOrder" */ '@pages/ServicesPage/VDS/VDSOrder/VDSOrder'),
)
const VDSip = lazy(() =>
  import(/* webpackChunkName: "VDSip" */ '@pages/ServicesPage/VDS/VDSip/VDSip'),
)

const SharedHosting = lazy(() =>
  import(
    /* webpackChunkName: "SharedHosting" */ '@pages/ServicesPage/SharedHosting/SharedHosting'
  ),
)
const SharedHostingOrder = lazy(() =>
  import(
    /* webpackChunkName: "SharedHostingOrder" */ '@pages/ServicesPage/SharedHosting/SharedHostingOrder/SharedHostingOrder'
  ),
)

const SiteCare = lazy(() =>
  import(/* webpackChunkName: "SiteCare" */ '@pages/ServicesPage/SiteCare/SiteCare'),
)
const SiteCareOrder = lazy(() =>
  import(
    /* webpackChunkName: "SiteCareOrder" */ '@pages/ServicesPage/SiteCare/SiteCareOrder/SiteCareOrder'
  ),
)

const VPN = lazy(() =>
  import(/* webpackChunkName: "VPNPage" */ '@pages/ServicesPage/VPN/VPN'),
)
const VpnOrder = lazy(() =>
  import(/* webpackChunkName: "VpnOrder" */ '@pages/ServicesPage/VPN/VpnOrder/VpnOrder'),
)

const DomainsPage = lazy(() =>
  import(
    /* webpackChunkName: "DomainsPage" */ '@pages/ServicesPage/DomainsPage/DomainsPage'
  ),
)
const DomainOrderPage = lazy(() =>
  import(
    /* webpackChunkName: "DomainOrderPage" */ '@pages/ServicesPage/DomainsPage/DomainOrderPage/DomainOrderPage'
  ),
)
const DomainContactInfoPage = lazy(() =>
  import(
    /* webpackChunkName: "DomainContactInfoPage" */ '@pages/ServicesPage/DomainsPage/DomainContactInfoPage/DomainContactInfoPage'
  ),
)
const DomainsNsPage = lazy(() =>
  import(
    /* webpackChunkName: "DomainsNsPage" */ '@pages/ServicesPage/DomainsPage/DomainsNsPage/DomainsNsPage'
  ),
)

const DedicatedServersPage = lazy(() =>
  import(
    /* webpackChunkName: "DedicatedServersPage" */ '@pages/ServicesPage/DedicatedServersPage/DedicatedServersPage'
  ),
)
const DedicOrderPage = lazy(() =>
  import(
    /* webpackChunkName: "DedicOrderPage" */ '@pages/ServicesPage/DedicatedServersPage/DedicOrderPage/DedicOrderPage'
  ),
)
const DedicIPpage = lazy(() =>
  import(
    /* webpackChunkName: "DedicIPpage" */ '@pages/ServicesPage/DedicatedServersPage/DedicIPPage/DedicIPPage'
  ),
)

const FTP = lazy(() =>
  import(/* webpackChunkName: "FTPPage" */ '@pages/ServicesPage/FTP/FTP'),
)
const FTPOrder = lazy(() =>
  import(/* webpackChunkName: "FTPOrder" */ '@pages/ServicesPage/FTP/FTPOrder/FTPOrder'),
)

const DNS = lazy(() =>
  import(/* webpackChunkName: "DNS" */ '@pages/ServicesPage/DNS/DNS'),
)
const DNSOrder = lazy(() =>
  import(/* webpackChunkName: "DNSOrder" */ '@pages/ServicesPage/DNS/DNSOrder/DNSOrder'),
)

const ForexPage = lazy(() =>
  import(/* webpackChunkName: "ForexPage" */ '@pages/ServicesPage/ForexPage/ForexPage'),
)
const ForexOrderPage = lazy(() =>
  import(
    /* webpackChunkName: "ForexOrderPage" */ '@pages/ServicesPage/ForexPage/ForexOrderPage/ForexOrderPage'
  ),
)

const AccessLogPage = lazy(() =>
  import(/* webpackChunkName: "AccessLogPage" */ '@pages/AccessLogPage/AccessLogPage'),
)

const PayersPage = lazy(() =>
  import(/* webpackChunkName: "PayersPage" */ '@pages/PayersPage/PayersPage'),
)

const Contracts = lazy(() =>
  import(/* webpackChunkName: "ContractsPage" */ '@pages/Contracts/Contracts'),
)

const UserSettings = lazy(() =>
  import(/* webpackChunkName: "UserSettingsPage" */ '@pages/UserSettings/UserSettings'),
)

const PhoneVerificationPage = lazy(() =>
  import(
    /* webpackChunkName: "PhoneVerificationPage" */ '@pages/PhoneVerificationPage/PhoneVerificationPage'
  ),
)

const ShellСomponent = props => {
  const { children, title } = props

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
    'user_settings',
  ])

  const titleString = title?.map(e => t(e.value, { ns: e.ns }))?.join('/')

  return (
    <Suspense fallback={<Loader />}>
      <PageTitleRender title={titleString}>{children}</PageTitleRender>
    </Suspense>
  )
}

export const ServicesPageLazy = () => {
  const title = [{ value: 'aside_menu.services', ns: 'container' }]

  return (
    <ShellСomponent title={title}>
      <ServicesPage children={<ServicesList />} />
    </ShellСomponent>
  )
}

export const VDSPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'VDS', ns: '' },
  ]

  return (
    <ShellСomponent title={title}>
      <VDS />
    </ShellСomponent>
  )
}

export const VDSOrderLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'vps_order', ns: 'crumbs' },
  ]

  return (
    <ShellСomponent title={title}>
      <VDSOrder />
    </ShellСomponent>
  )
}

export const VDSipLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'VDS', ns: '' },
    { value: 'ip_address', ns: 'vds' },
  ]

  return (
    <ShellСomponent title={title}>
      <VDSip />
    </ShellСomponent>
  )
}

export const SharedHostingLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'burger_menu.services.services_list.virtual_hosting', ns: 'container' },
  ]

  return (
    <ShellСomponent title={title}>
      <SharedHosting />
    </ShellСomponent>
  )
}

export const SharedHostingOrderLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'Virtual hosting order', ns: 'virtual_hosting' },
  ]

  return (
    <ShellСomponent title={title}>
      <SharedHostingOrder />
    </ShellСomponent>
  )
}

export const SiteCareLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'burger_menu.services.services_list.wetsite_care', ns: 'container' },
  ]

  return (
    <ShellСomponent title={title}>
      <SiteCare />
    </ShellСomponent>
  )
}

export const SiteCareOrderLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'Website care order', ns: 'virtual_hosting' },
  ]

  return (
    <ShellСomponent title={title}>
      <SiteCareOrder />
    </ShellСomponent>
  )
}

export const VPNLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'VPN', ns: 'container' },
  ]

  return (
    <ShellСomponent title={title}>
      <VPN />
    </ShellСomponent>
  )
}

export const VPNOrderLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'vpn_order', ns: 'crumbs' },
  ]

  return (
    <ShellСomponent title={title}>
      <VpnOrder />
    </ShellСomponent>
  )
}

export const DomainsPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'burger_menu.services.services_list.domains', ns: 'container' },
  ]

  return (
    <ShellСomponent title={title}>
      <DomainsPage />
    </ShellСomponent>
  )
}

export const DomainOrderPageLazy = ({ transfer }) => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: transfer ? 'Domain name transfer' : 'Domain name order', ns: 'domains' },
  ]

  return (
    <ShellСomponent title={title}>
      <DomainOrderPage transfer={transfer} />
    </ShellСomponent>
  )
}

export const DomainContactInfoPageLazy = ({ transfer }) => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: transfer ? 'Domain name transfer' : 'Domain name order', ns: 'domains' },
    { value: 'Owner contacts', ns: 'domains' },
  ]

  return (
    <ShellСomponent title={title}>
      <DomainContactInfoPage transfer={transfer} />
    </ShellСomponent>
  )
}

export const DomainsNsPageLazy = ({ transfer }) => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: transfer ? 'Domain name transfer' : 'Domain name order', ns: 'domains' },
    { value: 'Owner contacts', ns: 'domains' },
    { value: 'Service parameters', ns: 'domains' },
  ]

  return (
    <ShellСomponent title={title}>
      <DomainsNsPage transfer={transfer} />
    </ShellСomponent>
  )
}

export const DedicatedServersPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'burger_menu.services.services_list.dedicated_servers', ns: 'container' },
  ]

  return (
    <ShellСomponent title={title}>
      <DedicatedServersPage />
    </ShellСomponent>
  )
}

export const DedicOrderPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'page_title', ns: 'dedicated_servers' },
  ]

  return (
    <ShellСomponent title={title}>
      <DedicOrderPage />
    </ShellСomponent>
  )
}

export const DedicIPpageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'ip', ns: 'crumbs' },
  ]

  return (
    <ShellСomponent title={title}>
      <DedicIPpage />
    </ShellСomponent>
  )
}

export const FTPPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'burger_menu.services.services_list.external_ftp', ns: 'container' },
  ]

  return (
    <ShellСomponent title={title}>
      <FTP />
    </ShellСomponent>
  )
}

export const FTPOrderPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'ftp_order', ns: 'crumbs' },
  ]

  return (
    <ShellСomponent title={title}>
      <FTPOrder />
    </ShellСomponent>
  )
}

export const DNSPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'burger_menu.services.services_list.dns_hosting', ns: 'container' },
  ]

  return (
    <ShellСomponent title={title}>
      <DNS />
    </ShellСomponent>
  )
}

export const DNSOrderPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'dns_order', ns: 'crumbs' },
  ]

  return (
    <ShellСomponent title={title}>
      <DNSOrder />
    </ShellСomponent>
  )
}

export const ForexPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'forex', ns: 'crumbs' },
  ]

  return (
    <ShellСomponent title={title}>
      <ForexPage />
    </ShellСomponent>
  )
}

export const ForexOrderPageLazy = () => {
  const title = [
    { value: 'aside_menu.services', ns: 'container' },
    { value: 'forex_order', ns: 'crumbs' },
  ]

  return (
    <ShellСomponent title={title}>
      <ForexOrderPage />
    </ShellСomponent>
  )
}

export const AccessLogPageLazy = () => {
  const title = [{ value: 'access_log', ns: 'access_log' }]

  return (
    <ShellСomponent title={title}>
      <AccessLogPage />
    </ShellСomponent>
  )
}

export const PayersPageLazy = () => {
  const title = [{ value: 'Payers', ns: 'payers' }]

  return (
    <ShellСomponent title={title}>
      <PayersPage />
    </ShellСomponent>
  )
}

export const ContractsPageLazy = () => {
  const title = [{ value: 'profile.contracts', ns: 'container' }]

  return (
    <ShellСomponent title={title}>
      <Contracts />
    </ShellСomponent>
  )
}

export const UserSettingsPageLazy = () => {
  const title = [{ value: 'User Settings', ns: 'user_settings' }]

  return (
    <ShellСomponent title={title}>
      <UserSettings />
    </ShellСomponent>
  )
}

export const PhoneVerificationPageLazy = () => {
  const title = [{ value: 'Phone Verification', ns: 'user_settings' }]

  return (
    <ShellСomponent title={title}>
      <PhoneVerificationPage />
    </ShellСomponent>
  )
}
