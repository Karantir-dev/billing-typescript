import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  Container,
  EmailConfirmation,
  PrivateRoute,
  TrustedUsers,
} from '../../Components'
import {
  AccessLogPage,
  AffiliateProgram,
  BillingPage,
  ErrorPage,
  MainPage,
  OpenedTicker,
  PayersPage,
  SupportPage,
  UserSettings,
} from '../../Pages'

import * as route from '../../routes'

const Component = () => {
  return (
    <Container>
      <Routes>
        <Route
          path={route.HOME}
          element={<PrivateRoute children={<MainPage />} redirectTo={route.LOGIN} />}
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
        <Route path="*" element={<Navigate replace to={route.HOME} />} />
      </Routes>
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
