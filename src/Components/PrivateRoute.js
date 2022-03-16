import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authSelectors } from '../Redux/auth/authSelectors'
/**
 * - If the route is private and the user is logged in, render the component
 * - Otherwise render Redirect to /auth
 */
export function PrivateRoute({ redirectTo, children }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)

  return isAuthenticated ? children : <Navigate to={redirectTo} />
}
