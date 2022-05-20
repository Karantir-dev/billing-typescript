import React from 'react'
import AuthRoutes from './public/AuthRoutes'
import SecureRoutes from './secure/SecureRoutes'
import { useSelector } from 'react-redux'
import { authSelectors } from '../Redux'

const Component = () => {
  const isAuthenticated = useSelector(authSelectors.getSessionId)

  return <>{isAuthenticated ? <SecureRoutes /> : <AuthRoutes />}</>
}

export default Component
