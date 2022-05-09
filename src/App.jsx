import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
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
  TrustedUsers,
  Container,
  EmailConfirmation,
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
  BillingPage,
} from './Pages'
import 'dayjs/locale/ru'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
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
                path={`${route.BILLING}/*`}
                element={
                  <PrivateRoute redirectTo={route.LOGIN} children={<BillingScreen />} />
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
                  <PrivateRoute
                    children={<AffiliateProgram />}
                    redirectTo={route.LOGIN}
                  />
                }
              />

              <Route
                path={route.TRUSTED_USERS}
                // element={
                //   <PrivateRoute children={<TrustedUsers />} redirectTo={route.LOGIN} />
                // }
                element={<PublicRoute children={<TrustedUsers />} />}
              />
              <Route
                path={route.CONFIRM_EMAIL}
                element={
                  <PrivateRoute
                    children={<EmailConfirmation />}
                    redirectTo={route.LOGIN}
                  />
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
    </Provider>
  )
}

const SupportScreen = () => {
  const location = useLocation()

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

const BillingScreen = () => {
  const location = useLocation()

  if (location.pathname === route.BILLING) {
    return <Navigate to={`${route.BILLING}/payments`} />
  }

  return (
    <Container>
      <Routes>
        <Route
          path=":path/*"
          element={<PrivateRoute redirectTo={route.LOGIN} children={<BillingPage />} />}
        />
        <Route
          path=":path/:id"
          element={<PrivateRoute redirectTo={route.LOGIN} children={<BillingPage />} />}
        />
      </Routes>
    </Container>
  )
}
