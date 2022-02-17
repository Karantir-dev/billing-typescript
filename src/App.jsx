import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// import { AuthPage } from './Pages/AuthPage'
import { SignupPage } from './Pages/SignupPage'
import { MainPage } from './Pages/MainPage'
import PasswordResetPage from './Pages/PasswordResetPage'
import { PrivateRoute } from './Components/PrivateRoute'
import { PublicRoute } from './Components/PublicRoute'
import LoginForm from './Components/LoginForm/LoginForm'

function App() {
  return (
    <Suspense fallback="Загружаем...">
      <Routes>
        <Route
          path="/login"
          element={<PublicRoute children={<LoginForm />} restricted redirectTo="/" />}
        />
        <Route
          path="/signup"
          element={<PublicRoute children={<SignupPage />} restricted redirectTo="/" />}
        />
        <Route
          path="/reset"
          element={
            <PublicRoute children={<PasswordResetPage />} restricted redirectTo="/" />
          }
        />
        <Route
          path="/"
          element={<PrivateRoute children={<MainPage />} redirectTo="/login" />}
        ></Route>
      </Routes>
    </Suspense>
  )
}

export default App
