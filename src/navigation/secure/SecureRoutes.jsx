import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  Cart,
  Container,
  EmailConfirmation,
  Portal,
  PrivateRoute,
  ServicesList,
  TrustedUsers,
} from '../../Components'
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
} from '../../Pages'

import { cartSelectors } from '../../Redux'

import * as route from '../../routes'

const Component = () => {
  const cartState = useSelector(cartSelectors?.getCartIsOpened)

  return (
    <Container>
      <Routes>
        <Route
          path={route.SERVICES}
          element={
            <PrivateRoute
              children={<ServicesPage children={<ServicesList />} />}
              redirectTo={route.LOGIN}
            />
          }
        />
        <Route
          path={route.VDS}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<VDS />} />}
        />
        <Route
          path={route.VDS_ORDER}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<VDSOrder />} />}
        />
        <Route
          path={route.VDS_IP}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<VDSip />} />}
        />

        <Route
          path={route.SHARED_HOSTING}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<SharedHosting />} />}
        />
        <Route
          path={route.SHARED_HOSTING_ORDER}
          element={
            <PrivateRoute redirectTo={route.LOGIN} children={<SharedHostingOrder />} />
          }
        />

        <Route
          path={route.SITE_CARE}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<SiteCare />} />}
        />

        <Route
          path={route.DOMAINS}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<DomainsPage />} />}
        />
        <Route
          path={route.DOMAINS_ORDERS}
          element={
            <PrivateRoute redirectTo={route.LOGIN} children={<DomainOrderPage />} />
          }
        />
        <Route
          path={route.DOMAINS_CONTACT_INFO}
          element={
            <PrivateRoute redirectTo={route.LOGIN} children={<DomainContactInfoPage />} />
          }
        />
        <Route
          path={route.DOMAINS_NS}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<DomainsNsPage />} />}
        />
        <Route
          path={route.DOMAINS_TRANSFER_ORDERS}
          element={
            <PrivateRoute
              redirectTo={route.LOGIN}
              children={<DomainOrderPage transfer />}
            />
          }
        />
        <Route
          path={route.DOMAINS_TRANSFER_CONTACT_INFO}
          element={
            <PrivateRoute
              redirectTo={route.LOGIN}
              children={<DomainContactInfoPage transfer />}
            />
          }
        />
        <Route
          path={route.DOMAINS_TRANSFER_NS}
          element={
            <PrivateRoute
              redirectTo={route.LOGIN}
              children={<DomainsNsPage transfer />}
            />
          }
        />

        <Route
          path={route.DEDICATED_SERVERS}
          element={
            <PrivateRoute redirectTo={route.LOGIN} children={<DedicatedServersPage />} />
          }
        />

        <Route
          path={route.DEDICATED_SERVERS_ORDER}
          element={
            <PrivateRoute redirectTo={route.LOGIN} children={<DedicOrderPage />} />
          }
        />

        <Route
          path={route.DEDICATED_SERVERS_IP}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<DedicIPpage />} />}
        />

        <Route
          path={route.FTP}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<FTP />} />}
        />
        <Route
          path={route.FTP_ORDER}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<FTPOrder />} />}
        />

        <Route
          path={route.DNS}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<DNS />} />}
        />
        <Route
          path={route.DNS_ORDER}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<DNSOrder />} />}
        />

        <Route
          path={route.FOREX}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<ForexPage />} />}
        />
        <Route
          path={route.FOREX_ORDER}
          element={
            <PrivateRoute redirectTo={route.LOGIN} children={<ForexOrderPage />} />
          }
        />

        <Route
          path={route.ACCESS_LOG}
          element={<PrivateRoute redirectTo={route.LOGIN} children={<AccessLogPage />} />}
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
          element={<PrivateRoute redirectTo={route.LOGIN} children={<PayersPage />} />}
        />
        <Route
          path={route.CONTRACTS}
          element={<PrivateRoute children={<Contracts />} redirectTo={route.LOGIN} />}
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
          path={`${route.AFFILIATE_PROGRAM}/*`}
          element={
            <PrivateRoute children={<AffiliateProgram />} redirectTo={route.LOGIN} />
          }
        />
        <Route
          path={route.TRUSTED_USERS}
          element={<PrivateRoute children={<TrustedUsers />} redirectTo={route.LOGIN} />}
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

  if (location.pathname === route.SUPPORT) {
    return <Navigate to={`${route.SUPPORT}/requests`} />
  }

  return (
    <Routes>
      <Route
        path=":path/*"
        element={<PrivateRoute redirectTo={route.LOGIN} children={<SupportPage />} />}
      />
      <Route
        path=":path/:id"
        element={<PrivateRoute redirectTo={route.LOGIN} children={<OpenedTicker />} />}
      />
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
      <Route
        path=":path/*"
        element={<PrivateRoute redirectTo={route.LOGIN} children={<BillingPage />} />}
      />
      <Route
        path=":path/:result"
        element={<PrivateRoute redirectTo={route.LOGIN} children={<BillingPage />} />}
      />
    </Routes>
  )
}

export default Component
