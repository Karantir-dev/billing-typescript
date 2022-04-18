import React, { Suspense } from 'react'
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
} from './Components'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import entireStore from './Redux/store'

import {
  AuthPage,
  MainPage,
  AccessLogPage,
  AboutAffiliateProgram,
  SupportPage,
  OpenedTicker,
} from './Pages'
import { useTranslation } from 'react-i18next'
import * as route from './routes'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

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
                path={route.AFFILIATE_PROGRAM_ABOUT}
                element={
                  <PrivateRoute
                    children={<AboutAffiliateProgram />}
                    redirectTo={route.LOGIN}
                  />
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
