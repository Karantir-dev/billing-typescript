import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authSelectors } from '../../Redux/auth/authSelectors'
import { userOperations } from '../../Redux/userInfo/userOperations'
/**
 * - If the route is private and the user is logged in, render the component
 * - Otherwise render Redirect to /auth
 */
export default function PrivateRoute({ redirectTo, children }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)
  const dispatch = useDispatch()

  useEffect(() => {
    // if (isAuthenticated) {
    //   dispatch(userOperations.getUserInfo(isAuthenticated))
    //   dispatch(userOperations.getItems(isAuthenticated))
    //   dispatch(userOperations.getTickets(isAuthenticated))
    // }
  }, [])

  return isAuthenticated ? children : <Navigate to={redirectTo} />
}
