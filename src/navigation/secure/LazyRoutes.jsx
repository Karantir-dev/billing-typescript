import { Suspense, lazy } from 'react'
import { PageTitleRender, ServicesList, Loader } from '@components'
import { useTranslation } from 'react-i18next'

const ServicesPage = lazy(() => import(/* webpackChunkName: "ServicesPage" */ '@pages/ServicesPage/ServicesPage'))

const VDS = lazy(() => import('@pages/ServicesPage/VDS/VDSPage/VDS'))
const VDSOrder = lazy(() => import('@pages/ServicesPage/VDS/VDSOrder/VDSOrder'))
const VDSip = lazy(() => import('@pages/ServicesPage/VDS/VDSip/VDSip'))

const SharedHosting = lazy(() =>
  import('@pages/ServicesPage/SharedHosting/SharedHosting'),
)
const SharedHostingOrder = lazy(() =>
  import('@pages/ServicesPage/SharedHosting/SharedHostingOrder/SharedHostingOrder'),
)

const SiteCare = lazy(() => import('@pages/ServicesPage/SiteCare/SiteCare'))
const SiteCareOrder = lazy(() =>
  import('@pages/ServicesPage/SiteCare/SiteCareOrder/SiteCareOrder'),
)

const VPN = lazy(() => import('@pages/ServicesPage/VPN/VPN'))
const VpnOrder = lazy(() => import('@pages/ServicesPage/VPN/VpnOrder/VpnOrder'))

const DomainsPage = lazy(() => import('@pages/ServicesPage/DomainsPage/DomainsPage'))
const DomainOrderPage = lazy(() =>
  import('@pages/ServicesPage/DomainsPage/DomainOrderPage/DomainOrderPage'),
)
const DomainContactInfoPage = lazy(() =>
  import('@pages/ServicesPage/DomainsPage/DomainContactInfoPage/DomainContactInfoPage'),
)
const DomainsNsPage = lazy(() =>
  import('@pages/ServicesPage/DomainsPage/DomainsNsPage/DomainsNsPage'),
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
