import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Routes, Route } from 'react-router-dom'

import { AuthPage } from './Pages/AuthPage/AuthPage'
import { SignupForm } from './Components/SignupForm/SignupForm'
import { MainPage } from './Pages/MainPage'
import { PrivateRoute } from './Components/PrivateRoute'
import { PublicRoute } from './Components/PublicRoute'
import { LoginForm } from './Components/LoginForm/LoginForm'
import { PasswordReset } from './Components/PasswordReset/PasswordReset'
import { PasswordChange } from './Components/PasswordChange/PasswordChange'
import * as route from './routes'
import { Loader } from './Components/Loader/Loader'


function App() {
  return (
    <>
      <Suspense fallback={''}>
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
          ></Route>
        </Routes>
      </Suspense>
      {ReactDOM.createPortal(<Loader />, document.getElementById('portal'))}
    </>
  )
}

export default App
