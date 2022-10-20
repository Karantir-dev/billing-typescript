import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authSelectors, userOperations } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import * as route from '../../routes'

export default function MainEmailConfirmation() {
  const isAuthenticated = useSelector(authSelectors.getSessionId)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    console.log(params)
    if (params?.key && params?.username) {
      dispatch(userOperations.verifyMainEmail(params?.key, params?.username))
    }
  }, [])

  return <Navigate to={isAuthenticated ? route.SERVICES : route.LOGIN} />
}
