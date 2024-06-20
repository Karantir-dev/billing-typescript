import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { settingsOperations } from '@redux'
import { useDispatch } from 'react-redux'
import * as route from '@src/routes'

export default function Component() {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    dispatch(settingsOperations.confirmEmail(params?.key))
  }, [])

  return <Navigate to={route.USER_SETTINGS_PERSONAL} replace={true} />
}
