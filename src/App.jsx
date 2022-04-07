import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Routes, Route } from 'react-router-dom'

import {
  Loader,
  LoginForm,
  SignupForm,
  PasswordChange,
  PasswordReset,
  PrivateRoute,
  PublicRoute,
} from './Components'

import { AuthPage, MainPage, AccessLogScreen } from './Pages'

import * as route from './routes'

export default function App() {
  return (
    <>
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
              <PrivateRoute children={<MainPage children={<AccessLogScreen />} />} />
            }
          />
        </Routes>
      </Suspense>
      {ReactDOM.createPortal(<Loader />, document.getElementById('portal'))}
    </>
  )
}
