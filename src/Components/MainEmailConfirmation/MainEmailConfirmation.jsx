import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authSelectors, userOperations, userSelectors } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import * as route from '../../routes'

export default function MainEmailConfirmation() {
  const isAuthenticated = useSelector(authSelectors.getSessionId)
  const userInfo = useSelector(userSelectors.getUserInfo)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    if (params?.key && params?.username && userInfo.$email_verified === 'off') {
      dispatch(userOperations.verifyMainEmail(params?.key, params?.username))
    }
  }, [])

  return <Navigate to={isAuthenticated ? route.SERVICES : route.LOGIN} />
}
