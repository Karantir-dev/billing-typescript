import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom'

import {
  Loader,
  LoginForm,
  SignupForm,
  PasswordChange,
  PasswordReset,
  PrivateRoute,
  PublicRoute,
  Portal,
  TrustedUsers,
} from './Components'
import entireStore from './Redux/store'
import * as route from './routes'
import {
  AuthPage,
  MainPage,
  AccessLogPage,
  AffiliateProgram,
  SupportPage,
  OpenedTicker,
} from './Pages'

export default function App() {
  const { i18n } = useTranslation()
  dayjs.locale(i18n.language)

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

  return (
    <Provider store={entireStore.store}>
      <PersistGate loading={null} persistor={entireStore.persistor}>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route
                path={route.LOGIN}
                element={
                  <PublicRoute
                    children={<AuthPage children={<LoginForm />} />}
                    restricted
                    redirectTo={route.HOME}
                  />
                }
              />
              <Route
                path={route.REGISTRATION}
                element={
                  <PublicRoute
                    children={<AuthPage children={<SignupForm />} />}
                    restricted
                    redirectTo={route.HOME}
                  />
                }
              />

              <Route
                path={route.RESET_PASSWORD}
                element={
                  <PublicRoute
                    children={<AuthPage children={<PasswordReset />} />}
                    restricted
                    redirectTo={route.HOME}
                  />
                }
              />
              <Route
                path={route.CHANGE_PASSWORD}
                element={
                  <PublicRoute
                    children={<AuthPage children={<PasswordChange />} />}
                    restricted
                    redirectTo={route.HOME}
                  />
                }
              />
              <Route
                path={route.HOME}
                element={
                  <PrivateRoute children={<MainPage />} redirectTo={route.LOGIN} />
                }
              />
              <Route
                path={route.ACCESS_LOG}
                element={
                  <PrivateRoute redirectTo={route.LOGIN} children={<AccessLogPage />} />
                }
              />
              <Route
                path={`${route.SUPPORT}/*`}
                element={
                  <PrivateRoute redirectTo={route.LOGIN} children={<SupportScreen />} />
                }
              />
              <Route
                path={route.AFFILIATE_PROGRAM}
                element={
                  <PrivateRoute
                    children={<AffiliateProgram />}
                    redirectTo={route.LOGIN}
                  />
                }
              >
                <Route
                  path={':chapter'}
                  element={
                    <PrivateRoute
                      children={<AffiliateProgram />}
                      redirectTo={route.LOGIN}
                    />
                  }
                />
              </Route>

              <Route
                path={route.TRUSTED_USERS}
                element={
                  <PrivateRoute children={<TrustedUsers />} redirectTo={route.LOGIN} />
                }
              />
            </Routes>
          </Suspense>

          <Portal>
            <Loader />
          </Portal>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}
