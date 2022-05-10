import React, { Suspense } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import dayjs from 'dayjs'
import { Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {
  Loader,
  LoginForm,
  SignupForm,
  PasswordChange,
  PasswordReset,
  PrivateRoute,
  PublicRoute,
  Portal,
  Container,
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
  UserSettings,
} from './Pages'
import { useTranslation } from 'react-i18next'
import 'dayjs/locale/ru'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
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
              element={<PrivateRoute children={<MainPage />} redirectTo={route.LOGIN} />}
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
              path={`${route.USER_SETTINGS}`}
              element={
                <PrivateRoute
                  redirectTo={route.LOGIN}
                  children={
                    <Container>
                      <UserSettings />
                    </Container>
                  }
                />
              }
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
              element={
                <PrivateRoute children={<TrustedUsers />} redirectTo={route.LOGIN} />
              }
            />
          </Routes>
        </Suspense>
        <ToastContainer />
        <Portal>
          <Loader />
        </Portal>
      </BrowserRouter>
    </PersistGate>
  )
}

const SupportScreen = () => {
  const location = useLocation()
  const { i18n } = useTranslation()
  dayjs.locale(i18n.language)
  if (location.pathname === route.SUPPORT) {
    return <Navigate to={`${route.SUPPORT}/requests`} />
  }

  return (
    <Container>
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
    </Container>
  )
}
