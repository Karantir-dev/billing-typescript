import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { LoginPage } from './Pages/LoginPage'
import { SignupPage } from './Pages/SignupPage'
import { MainPage } from './Pages/MainPage'
import PasswordResetPage from './Pages/PasswordResetPage'
import { PrivateRoute } from './Components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset" element={<PasswordResetPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute redirectTo="/login">
            <MainPage />
          </PrivateRoute>
        }
      ></Route>
    </Routes>
  )
}

export default App
