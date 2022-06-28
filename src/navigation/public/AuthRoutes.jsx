import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthPage } from '../../Pages'
import {
  LoginForm,
  PasswordChange,
  PasswordReset,
  PublicRoute,
  SignupForm,
  Google,
} from '../../Components'
import * as route from '../../routes'

const Component = () => {
  return (
    <Routes>
      <Route
        path={route.LOGIN}
        element={
          <PublicRoute
            children={<AuthPage children={<LoginForm />} />}
            restricted
            redirectTo={route.SERVICES}
          />
        }
      />
      <Route
        path={route.REGISTRATION}
        element={
          <PublicRoute
            children={<AuthPage children={<SignupForm />} />}
            restricted
            redirectTo={route.SERVICES}
          />
        }
      />

      <Route
        path={route.RESET_PASSWORD}
        element={
          <PublicRoute
            children={<AuthPage children={<PasswordReset />} />}
            restricted
            redirectTo={route.SERVICES}
          />
        }
      />
      <Route
        path={route.CHANGE_PASSWORD}
        element={
          <PublicRoute
            children={<AuthPage children={<PasswordChange />} />}
            restricted
            redirectTo={route.SERVICES}
          />
        }
      />
      <Route
        path={route.GOOGLE}
        element={
          <PublicRoute
            children={<AuthPage children={<Google />} />}
            restricted
            redirectTo={route.SERVICES}
          />
        }
      />
      <Route path="*" element={<Navigate replace to={route.LOGIN} />} />
    </Routes>
  )
}

export default Component
