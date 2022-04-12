import React, { Suspense } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
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
} from './Pages'

import * as route from './routes'

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
                element={<PrivateRoute children={<AccessLogPage />} />}
                redirectTo={route.LOGIN}
              />
              <Route
                path={route.SUPPORT}
                element={<PrivateRoute children={<SupportPage />} />}
                redirectTo={route.LOGIN}
              >
                <Route
                  path={':path'}
                  element={<PrivateRoute children={<SupportPage />} />}
                />
              </Route>
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
