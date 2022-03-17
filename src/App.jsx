import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import { AuthPage } from './Pages/AuthPage/AuthPage'
import { SignupForm } from './Components/SignupForm/SignupForm'
import { MainPage } from './Pages/MainPage'
import PasswordResetPage from './Pages/PasswordResetPage'
import { PrivateRoute } from './Components/PrivateRoute'
import { PublicRoute } from './Components/PublicRoute'
import { LoginForm } from './Components/LoginForm/LoginForm'
import * as route from './routes'

function App() {
  return (
    <Suspense fallback="Загружаем...">
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
              children={<PasswordResetPage />}
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
  )
}

export default App
