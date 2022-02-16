import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { LoginPage } from './Pages/LoginPage'
import { SignupPage } from './Pages/SignupPage'
import { MainPage } from './Pages/MainPage'
import PasswordResetPage from './Pages/PasswordResetPage'
import { PrivateRoute } from './Components/PrivateRoute'
import { PublicRoute } from './Components/PublicRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<PublicRoute children={<LoginPage />} restricted redirectTo="/" />}
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
  )
}

export default App
