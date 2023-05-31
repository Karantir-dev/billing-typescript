import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { settingsOperations } from '../../../Redux'
import { useDispatch } from 'react-redux'
import * as route from '../../../routes'

export default function Component() {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    dispatch(settingsOperations.confirmEmail(params?.key))
  }, [])

  return <Navigate to={`${route.USER_SETTINGS}/personal`} />
}
