import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authSelectors } from '../../Redux'
/**
 * - If the route is restricted and the user is logged in, render a redirect to /
 * - Otherwise render the component
 */
export default function PublicRoute({ redirectTo, children, restricted }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)

  return isAuthenticated && restricted ? <Navigate to={redirectTo} /> : children
}
